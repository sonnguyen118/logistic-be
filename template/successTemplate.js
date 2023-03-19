
const successTemplate = {}
successTemplate.createForm = (msg) => {
  return `<html>

<head> </head>
<style>
  @import url("https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap");

  body {
    text-align: center;
    padding: 40px 0;
    background: #ebf0f5;
    font-family: "Roboto", sans-serif;
  }

  h1 {
    color: #88b04b;
    font-weight: 900;
    font-size: 40px;
    margin-bottom: 10px;
  }

  p {
    color: #404f5e;
    font-size: 20px;
    margin: 0;
    margin-bottom: 20px;
  }

  i {
    color: #9abc66;
    font-size: 100px;
    line-height: 200px;
    margin-left: -15px;
  }

  .card {
    background: white;
    padding: 60px;
    border-radius: 4px;
    box-shadow: 0 2px 3px #c8d0d8;
    display: inline-block;
    margin: 0 auto;
  }

  .btn {
    padding: 5px 15px;
    background-color: #88b04b;
    color: #fff;
    text-decoration: none;
    border-radius: 3px;
    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  }
</style>

<body>
  <div class="card">
    <div style="
          border-radius: 200px;
          height: 200px;
          width: 200px;
          background: #f8faf5;
          margin: 0 auto;
        ">
      <i class="checkmark">✓</i>
    </div>
    <h1>Thành Công</h1>

    <p>${msg}</p>
  </div>

</body>

</html>`
}

module.exports = successTemplate