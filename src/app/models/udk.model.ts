export class Udk {

  public values: Record<string, string> = {};

  constructor(values: Record<string, string>) {
    this.values = values;
  }

  public get i(): string {
    return this.values.i;
  }

  public get l(): string {
    return this.values.l;
  }

  public get u(): string {
    return this.values.u;
  }

  public get a(): string {
    return this.values.a;
  }

  public toString(): string {
    let udkString = '';

    if (this.i) {
      udkString += this.i.toLowerCase().replace(/\s/g, '');
    }
    if (this.u) {
      udkString += this.u.toLowerCase().replace(/\s/g, '');
    }
    if (this.a) {
      udkString += this.a.toLowerCase().replace(/\s/g, '');
    }
    udkString = udkString.trim();

    return udkString;
  }
}
