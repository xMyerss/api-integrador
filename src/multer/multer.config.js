import multer from "multer";
import path from "path";
import { array } from "../array.js";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './src/storage/imgs')
    },
    filename: function (req, file, cb) {
      if (file != null || undefined) {
        array.data = `${file.fieldname}-${Date.now() + path.extname(file.originalname).toLocaleLowerCase()}`
      }
      cb(null, array.data)
    }
  })
  
  const upload = multer({ storage,
                          fileFilter: (req, file, cb) => {
                            const filetypes = /jpeg|jpg|png/;
                            const mimetype = filetypes.test(file.mimetype);
                            const extname = filetypes.test(path.extname(file.originalname));
                            if (mimetype && extname) {
                              return cb(null, true);
                            }
                            cb("El archivo debe ser valido");
                          }
                        })

  export default upload;