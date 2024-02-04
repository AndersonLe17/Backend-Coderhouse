import { Request, Response } from "express";
import { HttpResponse } from "../../config/HttpResponse";
import { Document, User } from "../dao/domain/user/User";
import UserService from "../services/user.service";
import { JsonWebToken } from "../../utils/jwt/JsonWebToken";
import { initializeApp } from "firebase/app";
import { FirebaseStorage, getStorage, ref, getDownloadURL, uploadBytesResumable, deleteObject } from "firebase/storage";
import { UserError } from "../dao/domain/user/user.error";
import { firebaseConfig } from "../../utils/firebase/FirebaseConfig";
import { decodeUtf8 } from "../../utils/decodeUTF-8";

export class UserController {
  private readonly userService: UserService;
  private readonly storage: FirebaseStorage;
  constructor() {
    this.userService = new UserService();
    initializeApp(firebaseConfig);
    this.storage = getStorage();
  }

  public async getUserByEmailToken(req: Request, res: Response) {
    const { email } = req.user as User;
    const user = await this.userService.findByEmail(email);

    if (user) {
      const { firstName, lastName, age, email, _id, role, documents, profile, status } = user;
      HttpResponse.Ok(res, { firstName, lastName, age, email, _id, role, documents, profile, status});
    } else {
      throw new UserError("User not found");
    }
  }

  public async getUserByToken(req: Request, res: Response) { 
    const { sub } = req.user as JsonWebToken;
    const user = await this.userService.findOne({ _id: sub });

    if (user) {
      const { _id, cart } = user;
      HttpResponse.Ok(res, { _id, cart });
    } else {
      throw new UserError("User not found");
    }
  }

  public async updateUserPremium(req: Request, res: Response) {
    const {uid} = req.params;
    const user = await this.userService.findOne({ _id: uid });
    if (user?.role === 'admin') throw new UserError("Unauthorized");
    if (user?.status !== "verified") throw new UserError("User not verified, please upload documents");
    
    const userUpdate = await this.userService.update(uid, {role: user!.role === 'user'? 'premium':'user'} as User);

    if (userUpdate) {
      HttpResponse.Ok(res, {role: userUpdate.role});
    } else {
      throw new UserError("User not found");
    }
  }

  public async deleteUserByEmail(req: Request, res: Response) {
    const {email} = req.params;
    const result = await this.userService.deleteByEmail(email);

    if (result > 0) {
      HttpResponse.Ok(res, {message: "User deleted"});
    } else {
      throw new UserError("User not found");
    }
  }

  public async updateDocuments(req: Request, res: Response) {
    const { uid } = req.params;
    const files = req.files as any[];
    let user = await this.userService.findOne({ _id: uid });

    const typeFiles = files.map(file => file.mimetype.split('/')[1]).reduce((acc, curr) => curr === "pdf" ? acc : 'others');
    if (typeFiles === 'others') throw new Error("Invalid file type");

    const typeDocuments = files.map(file => {
      const type = this.validateDocument(decodeUtf8(file.originalname.split('.')[0]));
      if (type === "Other") throw new Error("Invalid type document");
      return type;
    });
    if (typeDocuments.length !== files.length) throw new Error("Document not found");
    if (user!.documents.length > 0) user = await this.discardDocuments(user!, typeDocuments);

    const storageRefs = await Promise.all(files.map(async (_file, idx) => await ref(this.storage, `documents/${typeDocuments[idx] + "_" + uid}`)));
    const snapshots = await Promise.all(storageRefs.map(async (ref, idx) => await uploadBytesResumable(ref, files[idx]?.buffer, { contentType: files[idx].mimetype })));
    const downloadsURL = await Promise.all(snapshots.map(async (snapshot) => await getDownloadURL(snapshot.ref)));
    
    const documents: Document[] = downloadsURL.map((url, idx) => ({ name: typeDocuments[idx], reference: url } as Document));
    
    const userUpdate = await this.userService.update(uid, {documents: [...user!.documents, ...documents]} as User);
    if (userUpdate) {
      if (userUpdate.documents.length === 3) this.userService.update(uid, {status: 'verified'} as User);
      HttpResponse.Ok(res, {documents: userUpdate.documents});
    } else {
      throw new UserError("User not found");
    }
  }

  public async updateProfile(req: Request, res: Response) {
    const { uid } = req.params;
    const file = req.file;
    const user = await this.userService.findOne({ _id: uid });

    const typeDocument = file?.mimetype.split('/')[1];
    if (typeDocument !== 'jpeg' && typeDocument !== 'png') throw new Error("Invalid file type");

    if (user?.profile) {
      const storageRef = ref(this.storage, `profiles/profile_${uid}`);
      await deleteObject(storageRef);
    }

    const storageRef = ref(this.storage, `profiles/profile_${uid}`);
    const snapshot = await uploadBytesResumable(storageRef, file?.buffer!, { contentType: file?.mimetype });
    const downloadURL = await getDownloadURL(snapshot.ref);

    const userUpdate = await this.userService.update(uid, {profile: downloadURL} as User);

    if (userUpdate) {
      HttpResponse.Ok(res, {profile: userUpdate.profile});
    } else {
      throw new UserError("User not found");
    }
  }

  public async discardDocuments(user: User, typeDocument: string[]) {
    const docsFilter = typeDocument.filter(doc => user.documents.find(document => document.name === doc));
    docsFilter.forEach(async (doc) => {
      const documentFound = user.documents.find(document => document.name === doc);
      if (documentFound) {
        const storageRef = ref(this.storage, `documents/${documentFound.name + "_" + user._id}`);
        await deleteObject(storageRef);
      }
    });
    return await this.userService.update(user._id!, {documents: user.documents.filter(document => !docsFilter.includes(document.name))} as User);
  }

  public validateDocument(doc: string): string {
    const nameDocs = ['Identificación', 'Comprobante de domicilio', 'Comprobante de estado de cuenta'];
    return nameDocs.includes(doc)? doc : "Other";
  }

  public getPathDirectory(typeDocument: string) {
    if (typeDocument === 'pdf') return 'documents';
    if (typeDocument === 'jpeg' || typeDocument === 'png') return 'profiles';
    return 'others';
  }

}
