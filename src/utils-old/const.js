module.exports = {
    start: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        img{
            display: block;
            max-width: 100%;
            margin: 0 auto;
        }
    </style>
</head>
<body>
    `,
    end: `
</body>
</html>
    `,
    dom: `<img src="$$" />`
}