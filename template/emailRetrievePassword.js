const emailRetrievePasswordTemplate = (link, password) => {
  return `
  <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Email xác nhận đổi mật khẩu</title>
    <style>
      @import url("https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap");
      .email {
        background-color: #f5f5f5;
        font-family: "Roboto", sans-serif;
        padding-top: 20px;
      }
      .email__main {
        background-color: #fff;
        width: 60%;
        margin: 0px auto;
        padding: 20px 50px;
        box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
        border-radius: 10px;
        margin-bottom: 20px;
      }
      .email__main-group {
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #ededed;
        padding-bottom: 10px;
      }
      .email__main-group-bos {
      }
      .email__main-group-title {
        font-size: 30px;
        color: #05366b;
        font-weight: 600;
        text-align: right;
        letter-spacing: 2px;
        margin-bottom: 10px;
      }
      .email__main-group-sub {
        font-size: 16px;
        margin-top: 5px;
        text-align: right;
        font-weight: 600;
      }
      .email__main-logo {
        height: 100px;
        width: auto;
      }
      .email__main-header {
        font-size: 28px;
        font-weight: 800;
        padding-top: 15px;
      }
      .email__main-text {
        font-size: 15px;
        line-height: 25px;
      }
      .email__main-pass {
        font-size: 30px;
        font-weight: 600;
        color: #05366b;
        text-align: center;
        margin: 15px 0;
        letter-spacing: 5px;
      }
      .email__main-btn {
        padding: 10px 30px;
        background-color: #05366b;
        color: #fff;
        text-align: center;
        border-radius: 5px;
        text-decoration: none;
      }
      .email__main-btn-a {
        margin-top: 20px;
        text-align: center;
        margin-bottom: 20px;
      }
      .email__main-btn:hover {
        cursor: pointer;
      }
      .email__footer {
        text-align: center;
      }
      .email__footer-item {
      }
      .email__footer-item-a {
        font-size: 14px;
        color: #05366b;
      }
      .email__footer-item-company {
        margin: 5px 0;
        font-size: 20px;
        color: #05366b;
        font-weight: 600;
      }
      .email__footer-item-title {
        font-size: 14px;
        margin: 5px 0;
      }
      .email__footer-item-copyright {
        font-size: 12px;
        padding-bottom: 20px;
      }
    </style>
  </head>
  <body>
    <div class="email">
      <div class="email__main">
        <div class="email__main-group">
          <img
            class="email__main-logo"
            src="https://api.sinovietlogistics.vn/uploads/logo/icon-vietlogistics.png"
            alt="SinoViet LOgistics"
          />
          <div class="email__main-group-bos">
            <div class="email__main-group-title">SinoViet Logistics</div>
            <div class="email__main-group-sub">
              Vận chuyển 2 chiều Trung - Việt<br />
              Dịch vụ order - Kí gửi - Đổi tệ
            </div>
          </div>
        </div>
        <div class="email__main-header">Chào bạn</div>
        <div class="email__main-text">
          Chúng tôi nhận được một yêu cầu cấp lại mật khẩu từ bạn?
          <br />
          Chúng tôi sẽ đặt lại mật khẩu của bạn là:
        </div>
        <div class="email__main-pass">${password}</div>
        <div class="email__main-text">
          Để chắc chắn là bạn, hãy xác nhận, chúng tôi sẽ reset mật khẩu của bạn
        </div>
        <div class="email__main-btn-a">
          <a href="${link}" class="email__main-btn">Xác nhận</a>
        </div>
      </div>
      <div class="email__footer">
        <div class="email__footer-item">
          <a
            href="https://www.sinovietlogistics.vn/gioi-thieu"
            class="email__footer-item-a"
            >Giới Thiệu</a
          >
          |
          <a
            href="https://www.sinovietlogistics.vn/chinh-sach"
            class="email__footer-item-a"
            >Chính sách</a
          >
        </div>
        <div class="email__footer-item-company">SinoViet Logistics</div>
        <div class="email__footer-item-title">
          Vận chuyển 2 chiều Trung - Việt Dịch vụ order - Kí gửi - Đổi tệ
        </div>
        <div class="email__footer-item-copyright">
          © 2023 SinoViet Logistics.
        </div>
      </div>
    </div>
  </body>
</html>
  `;
};

module.exports = emailRetrievePasswordTemplate;
