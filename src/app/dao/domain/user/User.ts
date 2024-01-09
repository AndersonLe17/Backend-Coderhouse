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

  constructor(email: string, password: string, firstName: string, lastName: string, age: number, role: string, fromGithub: boolean, isForgottenPassword: boolean) {
    this.email = email;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
    this.age = age;
    this.role = role;
    this.fromGithub = fromGithub;
    this.isforgottenPassword = isForgottenPassword;
  }
}
