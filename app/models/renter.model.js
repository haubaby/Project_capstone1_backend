module.exports = mongoose => {
    const renterSchema = mongoose.Schema(
        {
            name: String,
            unit: String,
            price: Number,
            quantity:Number,
            sold:Number,
            note: String,
        },
        {timestamps: true}
    );

    renterSchema.method("toJSON", function () {
        const {__v, _id, ...object} = this.toObject();
        object.id = _id;
        return object;
    });

    return mongoose.model("renters", renterSchema);
};
