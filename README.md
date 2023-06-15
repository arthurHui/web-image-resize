## ✨ Features
* Optimize image to target size

## 📦Install

```sh
npm install resize-img
```

## 🔨Usage
```sh
import React, { useState } from "react";
import resize from "web-image-resize";

const Test = () => {

    const [file, setFile] = useState(null)
    const [img, setImg] = useState("")

    const handleFileChange = (e) => {
        setFile(e.target.files[0])
    }

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <button onClick={async () => await resize.optimize({
                file,
                maxFileSize: 50,
                maxDimensionPixel: 2048,
                maxDeviation: 100,
                iteration: 8,
                targetType: 'image/webp',
                callback: (data) => {
                    console.log(data)
                    setImg(URL.createObjectURL(data))
                }
            })}>resize</button>
            <img src={img} />
        </div>
    )
}

export default Test
```

## API

`file`
| Type | Default value | Description | 
| --- | --- | --- |
| File | Requested | The original file |

`maxFileSize`
| Type | Default value | Description |
| --- | --- | --- |
| number | Requested | Target size for optimization |

`callback`
| Type | Default value | Description |
| --- | --- | --- |
| Function | Requested | A callback function for return optimized file, this will return a Blob |

### optional
`maxDeviation`
| Type | Default value | Description |
| --- | --- | --- |
| number | 100 | Deviation for optimization |

`iteration`
| Type | Default value | Description |
| --- | --- | --- |
| number | 8 | Maximum times for optimization |

`targetType`
| Type | Default value | Description |
| --- | --- | --- |
| string | 'image/webp' | Target file type |
