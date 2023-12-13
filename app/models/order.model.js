module.exports = (mongoose) => {
  const orderSchema = mongoose.Schema(
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
      method: String,
      paypalId: String,
      address: String,
      email: String,
      eventTime: String,
      numberOfAttendes: Number,
      servicePack: String,
      totalAmount: Number,
      name: String,
      phone: String,
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
      status: String,
    },
    { timestamps: true }
  );
  return mongoose.model("orders", orderSchema);
};