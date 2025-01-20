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

    // bỏ khoảng trắng thừa ở các cột header
    const normalizeKeys = (data: any[]) => {
      return data.map((row) => {
        const normalizedRow: any = {};
        for (const key in row) {
          const trimmedKey = key.trim();
          normalizedRow[trimmedKey] = row[key];
        }
        return normalizedRow;
      });
    };

    // Chuyển đổi giá trị tiền tệ thành số
    const convertCurrency = (value: string) => {
      if (typeof value === "string") {
        value = value.replace(/[^\d.-]/g, "");
      }
      return parseFloat(value);
    };

    // Lọc các hàng có giá trị Sales > 50000
    const filterData = (data: any[]) => {
      const normalizedData = normalizeKeys(data);
      return normalizedData.filter((row) => {
        const salesValue = convertCurrency(row["Sales"]);
        return salesValue > 50000;
      });
    };

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
      } else {
        console.log("File downloaded successfully");
      }
    });
  } catch (error) {
    console.error("Error downloading or processing the file:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Task 3
// API lấy input
app.get("/input", async (req, res) => {
  try {
    const response = await axios.get(
      "https://share.shub.edu.vn/api/intern-test/input"
    );

    if (response.data && response.data.data) {
      res.json(response.data.data);
    } else {
      console.error("Dữ liệu trả về không hợp lệ:", response.data);
      res.status(500).send("Dữ liệu không hợp lệ từ API.");
    }
  } catch (error) {
    console.error("Lỗi khi gọi API:", error);
    res.status(500).send("Error fetching input data.");
  }
});

interface Query {
  type: "1" | "2";
  range: [number, number];
}

interface InputData {
  token: string;
  data: number[];
  query: Query[];
}
app.post("/processAndPost", async (req: Request, res: Response) => {
  try {
    const { inputData } = req.body;

    const {
      data,
      query: queries,
      token,
    }: { data: number[]; query: Query[]; token: string } = inputData;

    // Step 1: Xử lý dữ liệu
    const n = data.length;
    const prefix_sum = new Array(n).fill(0);
    const prefix_even_sum = new Array(n).fill(0);
    const prefix_odd_sum = new Array(n).fill(0);

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

    const results = queries.map((query) => {
      const [l, r] = query.range;

      if (query.type === "1") {
        return l === 0 ? prefix_sum[r] : prefix_sum[r] - prefix_sum[l - 1];
      } else if (query.type === "2") {
        const evenSum =
          l === 0
            ? prefix_even_sum[r]
            : prefix_even_sum[r] - prefix_even_sum[l - 1];
        const oddSum =
          l === 0
            ? prefix_odd_sum[r]
            : prefix_odd_sum[r] - prefix_odd_sum[l - 1];
        return evenSum - oddSum;
      }
    });

    const outputData = { results };
    if (outputData) {
      // Step 2: Post kết quả lên API output
      const outputResponse = await axios.post(
        "https://share.shub.com.vn/intern-test/output",
        outputData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Output API response:", outputResponse.data);
    }

    res.json({
      inputData,
      outputData,
    });
  } catch (error) {
    console.error("Lỗi trong quy trình xử lý và post kết quả:", error);
    res.status(500).send("Có lỗi xảy ra trong quá trình xử lý.");
  }
});

const port = 5000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
