export class User {
  _id?: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  age: number;
  cart?: string;
  role: string;
  fromGithub: boolean;
  isforgottenPassword: boolean;
  documents: Document[];
  lastConnection?: Date;
  status: string;

  constructor(email: string, password: string, firstName: string, lastName: string, age: number, role: string, fromGithub: boolean, isForgottenPassword: boolean, documents: Document[], status: string) {
    this.email = email;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
    this.age = age;
    this.role = role;
    this.fromGithub = fromGithub;
    this.isforgottenPassword = isForgottenPassword;
    this.documents = documents;
    this.status = status;
  }
}

export class Document {
  public name: string;
  public reference: string;

  constructor(name: string, reference: string) {
    this.name = name;
    this.reference = reference;
  }
}