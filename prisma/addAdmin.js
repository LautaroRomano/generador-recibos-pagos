const { PrismaClient } = require("../src/generated/prisma");
const crypto = require("crypto");

const prisma = new PrismaClient();

async function main() {
  // Default admin credentials - can be customized
  const adminEmail = process.env.ADMIN_EMAIL || "admin@digicom.net.ar";
  const adminPassword = process.env.ADMIN_PASSWORD || "Digicone444";
  const adminName = process.env.ADMIN_NAME || "Administrator";

  try {
    // Check if admin already exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { email: adminEmail },
    });

    if (existingAdmin) {
      console.log(`Admin with email ${adminEmail} already exists.`);
      return;
    }

    // Hash password
    const hashedPassword = hashPassword(adminPassword);

    // Create admin
    const admin = await prisma.admin.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: adminName,
      },
    });

    console.log(`Admin created successfully: ${admin.email}`);
  } catch (error) {
    console.error("Error creating admin:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .then(() => console.log("Admin setup completed"))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });

function hashPassword(password) {
  // Create a random salt
  const salt = crypto.randomBytes(16).toString("hex");

  // Hash the password with the salt
  const hash = crypto
    .pbkdf2Sync(
      password,
      salt,
      1000, // iterations
      64, // key length
      "sha256"
    )
    .toString("hex");

  // Return the salt and hash combined
  return `${salt}:${hash}`;
}
