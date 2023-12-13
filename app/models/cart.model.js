module.exports = (mongoose) => {
  const cartSchema = mongoose.Schema(
    {
      renters: [
        {
          renter: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "renters",
          },
          quantity: Number,
        },
      ],
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    },
    { timestamps: true }
  );

  cartSchema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  return mongoose.model("carts", cartSchema);
};
