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

  constructor(email: string, password: string, firstName: string, lastName: string, age: number, role: string, fromGithub: boolean) {
    this.email = email;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
    this.age = age;
    this.role = role;
    this.fromGithub = fromGithub;
  }
}
