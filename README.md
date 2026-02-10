# Upload Image

curl -X POST -H "x-api-key: YOUR_KEY" -F "file=@image.png" http://localhost:3040/api/upload/image

# Upload PDF

curl -X POST -H "x-api-key: YOUR_KEY" -F "file=@doc.pdf" http://localhost:3040/api/upload/pdf

# Upload PDF and Image

curl -X POST -H "x-api-key: YOUR_KEY" -F "file=@doc.pdf" http://localhost:3040/api/upload/mixed
