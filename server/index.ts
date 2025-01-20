import express, { Request, Response } from "express";
import cors from "cors";
import path from "path";
import axios from "axios";
import XLSX from "xlsx";
import fs from "fs";
import Zlib from "zlib";
const app = express();

app.use(cors());

app.use(express.json());

// Task 1
app.get("/download-file", async (req, res) => {
  try {
    const fileUrl = "https://go.microsoft.com/fwlink/?LinkID=521962";

    // Tải file Excel về dưới dạng stream
    const response = await axios.get(fileUrl, { responseType: "arraybuffer" });

    // Đọc dữ liệu Excel từ buffer
    const workbook = XLSX.read(response.data, { type: "buffer" });

    // Lấy sheet đầu tiên
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Chuyển đổi dữ liệu sheet thành dạng JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    // Hàm chuẩn hóa key (loại bỏ khoảng trắng thừa)
    const normalizeKeys = (data: any[]) => {
      return data.map((row) => {
        const normalizedRow: any = {};
        for (const key in row) {
          const trimmedKey = key.trim(); // Loại bỏ khoảng trắng thừa
          normalizedRow[trimmedKey] = row[key];
        }
        return normalizedRow;
      });
    };

    // Chuyển đổi giá trị tiền tệ thành số
    const convertCurrency = (value: string) => {
      if (typeof value === "string") {
        value = value.replace(/[^\d.-]/g, ""); // Loại bỏ ký tự không phải số
      }
      return parseFloat(value);
    };

    // Lọc các hàng có giá trị Sales > 50000
    const filterData = (data: any[]) => {
      const normalizedData = normalizeKeys(data); // Chuẩn hóa key
      return normalizedData.filter((row) => {
        const salesValue = convertCurrency(row["Sales"]); // Truy cập key đã chuẩn hóa
        return salesValue > 50000; // Lọc giá trị Sales > 50000
      });
    };

    // Gọi hàm lọc với dữ liệu JSON
    const filteredData = filterData(jsonData);

    // Tạo workbook mới từ dữ liệu đã lọc
    const newWorkbook = XLSX.utils.book_new();
    const newWorksheet = XLSX.utils.json_to_sheet(filteredData);
    XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, "FilteredData");

    // Lưu file đã lọc dưới dạng file Excel
    const filePath = path.join(__dirname, "filtered_sales.xlsx");
    const fileBlob = XLSX.write(newWorkbook, {
      bookType: "xlsx",
      type: "buffer",
    });

    // Ghi file đã lọc vào hệ thống
    fs.writeFileSync(filePath, fileBlob);

    // Tải file đã lọc về cho người dùng
    res.download(filePath, "filtered_sales.xlsx", (err) => {
      if (err) {
        console.error("Error during file download", err);
      }
    });
  } catch (error) {
    console.error("Error downloading or processing the file:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Task 3
// Định nghĩa các kiểu dữ liệu cho truy vấn
interface Query {
  type: "1" | "2";
  range: [number, number];
}

interface InputData {
  token: string;
  data: number[];
  query: Query[];
}

// API lấy input
app.get("/input", async (req, res) => {
  try {
    console.log("Request to API started...");
    const response = await axios.get(
      "https://share.shub.edu.vn/api/intern-test/input",
      {
        headers: {
          Connection: "keep-alive",
        },
      }
    );

    // Log dữ liệu để kiểm tra rõ hơn
    console.log("Raw response data:", response.data);

    if (response.data && response.data.data) {
      res.json(response.data.data);
    } else {
      console.error("Dữ liệu trả về không hợp lệ:", response.data);
      res.status(500).send("Dữ liệu không hợp lệ từ API.");
    }
  } catch (error) {
    console.error("Lỗi khi gọi API:", error); // Log chi tiết lỗi
    res.status(500).send("Error fetching input data.");
  }
});
// API xử lý các truy vấn và trả kết quả
app.post("/processQueries", (req: Request, res: Response) => {
  const { data, queries }: { data: number[]; queries: Query[] } = req.body;

  // Tiền tố mảng
  const n = data.length;
  const prefix_sum = new Array(n).fill(0);
  const prefix_even_sum = new Array(n).fill(0);
  const prefix_odd_sum = new Array(n).fill(0);

  // Cập nhật các mảng tiền tố
  prefix_sum[0] = data[0];
  prefix_even_sum[0] = data[0] % 2 === 0 ? data[0] : 0;
  prefix_odd_sum[0] = data[0] % 2 !== 0 ? data[0] : 0;

  for (let i = 1; i < n; i++) {
    prefix_sum[i] = prefix_sum[i - 1] + data[i];
    prefix_even_sum[i] =
      prefix_even_sum[i - 1] + (data[i] % 2 === 0 ? data[i] : 0);
    prefix_odd_sum[i] =
      prefix_odd_sum[i - 1] + (data[i] % 2 !== 0 ? data[i] : 0);
  }

  // Xử lý các truy vấn
  const results = queries.map((query) => {
    const [l, r] = query.range;

    if (query.type === "1") {
      // Loại 1: Tính tổng phần tử trong khoảng
      return l === 0 ? prefix_sum[r] : prefix_sum[r] - prefix_sum[l - 1];
    } else if (query.type === "2") {
      // Loại 2: Tính tổng với dấu chẵn/lẻ
      const evenSum =
        l === 0
          ? prefix_even_sum[r]
          : prefix_even_sum[r] - prefix_even_sum[l - 1];
      const oddSum =
        l === 0 ? prefix_odd_sum[r] : prefix_odd_sum[r] - prefix_odd_sum[l - 1];
      return evenSum - oddSum;
    }
  });

  res.json({ results });
});

const port = 5000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
