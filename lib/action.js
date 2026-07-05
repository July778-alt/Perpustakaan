"use server";

import bcrypt from "bcryptjs"
import pool from "./db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import path from "path";
import { writeFile } from "fs/promises";
import { z } from "zod";

const userSchema = z.object({
    username: z.string().min(3, "Username minimal 3 karakter"),
    email: z.string().email("Email tidak valid"),
    password: z.string().min(6, "Password harus 6 karakter"),
    role: z.enum(["admin", "public"]).default("public"),
});

const booksSchema = z.object({
    title: z.string().min(1, "Judul harus diisi"),
    sinopsis: z.string().min(1,"Sinopsis harus diisi"),
    author: z.string().min(1, "Author harus diisi"),
    publisher: z.string().min(1, "publisher harus diisi"),
    year_published: z.string().regex(/^\d+$/, "Tahus harus 4  digit"),
    stock: z.number().int().nonnegative().default(0),
});

// ==================== users ====================

// Create user
export async function storeUser(formData) {
    const data = userSchema.parse({
        username: formData.get("username"),
        email: formData.get("email"),
        password: formData.get("password"),
        role: formData.get("role") || "public",
    });

    const hashed = data.password
        ? bcrypt.hashSync(data.password, 10)
        : bcrypt.hashSync("password", 10)

    await pool.execute(
        "CALL insertUser(?, ?, ?, ?)",
        [data.username, data.email, hashed, data.role]
    )

    redirect("/dashboard")
}

// Get user by email
export async function getUserByEmail(email) {
    try {
        const [rows] = await pool.execute(
            "CALL getUserByEmail(?)", 
            [email]
        );

        console.log("getUserByEmail result:", rows);

        if (rows && rows.length > 0) {
            return rows[0][0];
        }

        return null;

    } catch (error) {
        console.error("Error in getUserByEmail:", error);
        return null;
    }
}

export async function updateUserProfile(formData) {
    const id = formData.get("id_users");
    const data = userSchema.partial().parse({
        username: formData.get("username"),
    });

  await pool.execute(
    "CALL editUserProfile(?, ?)",
    [id, data.username]
  );

  return true;
}

// Get all users
export async function getAllUsers() {
    const [rows] = await pool.execute(
        "CALL selectAllusers"
    )
    return rows[0];
}

// Update users side admin
export async function updateUsersSideAdmin(formData) {
    const id = formData.get("id_users");

    const data = userSchema.partial().parse({
        username: formData.get("username"),
        email: formData.get("email"),
        role: formData.get("role"),
    });

    await pool.execute(
        "CALL updateUserAdmin(?, ?,?, ?)",
        [id, data.username, data.email, data.role]
    )   
    
    revalidatePath("/dashboard");
    redirect("/dashboard");
}

// Delete user
export async function deleteUsers(id) {
    await pool.execute(
        "CALL deleteUser(?)", 
        [id]
    );
    
    revalidatePath("/dashboard");
}

export async function updateProfilePhoto(formData) {
    const id = formData.get("id_users");
    const file = formData.get("image");

    if (!file || file.size === 0) {
        throw new Error("No file uploaded");
    }

    // convert file → buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // simpan ke folder public/uploads
    const filename = `${Date.now()}-${file.name}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads");

    await writeFile(path.join(uploadDir, filename), buffer);

    const imagePath = `/uploads/${filename}`;

    // update database
    await pool.execute(
        "CALL updatePP(?, ?)",
        [id, imagePath]
    );

    // return path untuk update session
    return imagePath;
}


// ==================== BOOKS ====================

// Create book
export async function storeBooks(formData) {
    const data = booksSchema.parse({
        title : formData.get("title"),
        sinopsis : formData.get("sinopsis"),
        author : formData.get("author"),
        publisher : formData.get("publisher"),
        year_published : formData.get("year_published"),
        stock : parseInt(formData.get("stock"))
    });

    const file = formData.get("image");
    let imagePath = null;

    if (file && file.size > 0) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filename = `${Date.now()}-${file.name}`;
        const uploadDir = path.join(process.cwd(), "public", "uploads");
        await writeFile(path.join(uploadDir, filename), buffer);
        imagePath = `/uploads/${filename}`;
    }

    await pool.execute(
        "CALL insertBooks (?, ?, ?, ?, ?, ?, ?)",
        [data.title, data.sinopsis, data.author, data.publisher, data.year_published, data.stock, imagePath]
    );
    
    redirect("/dashboard")
}

// Get all books
export async function getAllBooks() {
    const [rows] = await pool.execute(
        "CALL selectBooks"
    )

    return rows[0];
}

// Delete book
export async function deleteBooks(id) {
    await pool.execute(
        "CALL deleteBook(?)",
        [id]
    );
         
    revalidatePath("/dashboard");
}

// Update book
export async function updateBooks(formData) {
    const id = formData.get("id_books");
    const data = booksSchema.parse({
        title : formData.get("title"),
        sinopsis : formData.get("sinopsis"),
        author : formData.get("author"),
        publisher : formData.get("publisher"),
        year_published : formData.get("year_published"),
        stock : parseInt(formData.get("stock"))
    });

    const file = formData.get("image");
    let imagePath = formData.get("currentImage") || null;

    if (file && file.size > 0) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filename = `${Date.now()}-${file.name}`;
        const uploadDir = path.join(process.cwd(), "public", "uploads");
        await writeFile(path.join(uploadDir, filename), buffer);
        imagePath = `/uploads/${filename}`;
    }

    await pool.execute(
        "CALL editBooks(?, ?, ?, ?, ?, ?, ?, ?)",
        [id, data.title, data.sinopsis, data.author, data.publisher, data.year_published, data.stock, imagePath]
    );

    redirect("/dashboard")
}

export async function getBookById(id) {
    const [rows] = await pool.execute(
        "CALL getBookById(?)",
        [id]
    );
    return rows[0][0] || null;
}

// ==================== BORROWS ====================

export async function getAllBorrows() {
    const [rows] = await pool.execute(
        "CALL getAllBorrows"
    );
    return rows[0];
}

export async function getBorrowsByUserId(userId) {
    const [rows] = await pool.execute(
        "CALL getBorrowsByUser(?)",
        [userId]);
    return rows[0] ?? [] ;
}

// Request borrow from public user
export async function requestBorrow(userId, bookId) {
    const borrowDate = new Date().toISOString().split('T')[0];
    const returnDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // 14 days later

    await pool.execute(
        "CALL requestBorrow(?, ?, ?, ?)",
        [userId, bookId, borrowDate, returnDate]
    );
    
    return { success: true };
}

// Approve borrow request (admin)
export async function approveBorrow(borrowId) {
    await pool.execute(
        "CALL approveBorrow(?)",
        [borrowId]
    );
    
    revalidatePath("/dashboard");
    return { success: true };
}

// Reject borrow request (admin)
export async function rejectBorrow(borrowId) {
    await pool.execute(
        "CALL rejectBorrow",
        [borrowId]
    );
    
    revalidatePath("/dashboard");
    return { success: true };
}

export async function updateBorrowStatus(id, status) {
    
    await pool.execute(
        "CALL updateStatus(?, ?)",
        [id, status]
    );
    
    revalidatePath("/dashboard");
}

export async function deleteBorrow(id) {
    await pool.execute(
        "CALL deleteBorrow(?)",
         [id]
        );
    revalidatePath("/dashboard");
}