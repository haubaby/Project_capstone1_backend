module.exports = mongoose => {
    const userSchema = mongoose.Schema(
        {
            firstName: String,
            lastName: String,
            email: String,
            password: String,
            role: String,
        },
        {timestamps: true}
    );

    userSchema.method("toJSON", function () {
        const {__v, _id, ...object} = this.toObject();
        object.id = _id;
        return object;
    });

    return mongoose.model("users", userSchema);
};
