# Menggunakan Node.js versi 20 (Alpine yang ringan)
FROM node:20-alpine

# Set direktori kerja di dalam container
WORKDIR /usr/src/app

# Menyalin file konfigurasi package.json
COPY package*.json ./

# Menginstall dependensi (termasuk express, mongoose, gemini, dll)
RUN npm install

# Menyalin seluruh source code backend ke dalam container
COPY . .

# Membuka port 5000 agar bisa diakses dari luar container
EXPOSE 5000

# Perintah untuk menjalankan server
CMD ["node", "src/server.js"]
