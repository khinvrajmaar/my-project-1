// validations/userValidation.js
const { z } = require("zod");

const userSignupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long."),
  contactNumber: z
    .string()
    .regex(/^\d{10}$/, "Contact number must be 10 digits."),
  password: z.string().min(6, "Password must be at least 6 characters long."),
});

module.exports = { userSignupSchema };
