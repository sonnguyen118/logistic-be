const emailTemplate = (formattedDate, user, urlVerify) => {
  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Xác thực tài khoản SinoViet Logistic</title>
    <style>
      /* Thiết kế giao diện email ở đây */
      @import url("https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap");

      html,
      body {
        margin: 0;
        padding: 0;
        background-color: #333;
        font-family: "Roboto", sans-serif;
      }

      .email__sub {
        color: #fff;
        text-align: center;
        font-style: italic;
        font-size: 13px;
      }

      .email__navbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 2%;
        background-color: #05366b;
        border-top-right-radius: 5px;
        border-top-left-radius: 5px;
      }

      .email__navbar-item {
        color: #bfbfbf;
        font-size: 13px;
      }

      .email__body {
        background-color: #ECECEC;
        padding-bottom: 15px;
      }

      .email__company {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0px 2%;
      }

      .email__company-logo {
        height: 90px;
        width: auto;
      }

      .email__company-text {
        text-align: left;
      }

      .email__company-text-1 {
        font-size: 22px;
        font-weight: 600;
        color: #05366b;
      }

      .email__company-text-2 {
        font-size: 14px;
        font-weight: 400;
        color: #05366b;
      }

      .email__master {
        background-color: #fff;
        margin: 0px 2%;
        padding-bottom: 20px;
      }

      .email__title {
        font-size: 20px;
        border-bottom: 1px solid #ededed;
        padding: 8px 2%;
        color: #05366b;
      }

      .email__main {
        line-height: 28px;
      }

      .email__subs {
        font-size: 18px;
        color: #333;
        margin: 4px 0;
      }

      .btn-verify {
        background-color: #05366b;
        color: #fff;
        text-decoration: none;
        padding: 8px 20px;
        border-radius: 5px;
        box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
        transition: all 0.3s ease-in-out;
      }

      .btn-verify:hover {
        background-color: #feb914;
        transition: all 0.3s ease-in-out;
      }

      @media only screen and (max-width: 600px) {

        /* Thiết lập CSS cho kích thước màn hình < 600px */
        .email {
          width: 90%;
          margin: 0 auto;
          border-radius: 6px;
          text-align: center;
          background-color: #fff;
        }
      }

      @media only screen and (min-width: 600px) and (max-width: 1199px) {

        /* CSS cho màn hình có kích thước nhỏ hơn 1200px và lớn hơn hoặc bằng 600px ở đây */
        .email {
          width: 70%;
          margin: 0 auto;
          border-radius: 6px;
          text-align: center;
          background-color: #fff;
        }
      }

      @media only screen and (min-width: 1200px) {

        /* Thiết lập CSS cho kích thước màn hình > 1200px */
        .email {
          width: 50%;
          margin: 0 auto;
          border-radius: 6px;
          text-align: center;
          background-color: #fff;
        }
      }
    </style>
  </head>
  <body>
    <div class="wrap">
      <p class="email__sub"> Đây là email tự động. Vui lòng không trả lời email này. </p>
      <div class="email">
        <div class="email__navbar">
          <div class="email__navbar-item">${formattedDate}</div>
          <div class="email__navbar-item"> Hotline: 0833 999 095</div>
        </div>
        <div class="email__body">
          <div class="email__company">
            <img src="https://www.freepnglogos.com/uploads/company-logo-png/file-mobile-apps-development-company-logo-25.png" alt="Viet-Sino logistic" class="email__company-logo"></img>
            <div class="email__company-text">
              <div class="email__company-text-1">SinoViet Logistics</div>
              <div class="email__company-text-2">Vận chuyển 2 chiều Trung - Việt</div>
              <div class="email__company-text-2">Dịch vụ order - Kí gửi - Đổi tệ</div>

            </div>
          </div>
          <div class="email__master">
            <h1 class="email__title">Xác thực tài khoản SinoViet Logistics</h1>
            <h6 class="email__subs">Chào Thành</h6>
            <p class="email__main"> 
            Người dùng <strong>${user.lastName + " " + user.firstName}</strong>
            <br /> Email: <strong>${user.email} </strong>
            <br /> Phone: <strong>${user.phone} </strong> 
            <br /> Click vào link để kích hoạt tài khoản này
            </p>
            <a href="${urlVerify}" class="btn-verify">Kích hoạt tài khoản</a>
          </div>
        </div>
      </div>
    </div>
  </body>
</html>`;
};

module.exports = emailTemplate;
