export class Cart {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly createdAt: Date,
    public updatedAt: Date
  ) {}
}
