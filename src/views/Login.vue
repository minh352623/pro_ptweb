<template>
  <div class="form">
    <ul class="tab-group">
      <li class="tab" :class="{ active: isShowRegister }">
        <a @click="showTabFormRegister">Sign Up</a>
      </li>
      <li class="tab" :class="{ active: !isShowRegister }">
        <a @click="showTabFormLogin">Sign in</a>
      </li>
    </ul>
    <div class="tab-content">
      <div class="text-green-500">{{ messageSuccess }}</div>
      <div v-if="isShowRegister" id="signup">
        <h1 class="text-2xl my-5 text-white">Sign Up for Free</h1>

        <Form @submit="signupAccount" :validation-schema="dataRegister">
          <div class="top-row">
            <div class="field-wrap">
              <Field
                v-model="dataRegister.firstName"
                type="text"
                name="firstName"
                autocomplete="off"
                placeholder="First Name *"
                class="px-3 py-3 text-white"
              />
              <ErrorMessage name="firstName" class="text-red-500" />
            </div>

            <div class="field-wrap">
              <Field
                v-model="dataRegister.lastName"
                class="px-3 py-3 text-white"
                placeholder="Last Name *"
                name="lastName"
                type="text"
                autocomplete="off"
              />
              <ErrorMessage name="lastName" class="text-red-500" />
            </div>
          </div>

          <div class="field-wrap">
            <Field
              v-model="dataRegister.email"
              name="email"
              class="px-3 py-3 text-white"
              placeholder="Email *"
              type="email"
              autocomplete="off"
            />
            <ErrorMessage name="email" class="text-red-500" />
          </div>

          <div class="field-wrap">
            <Field
              v-model="dataRegister.password"
              class="px-3 py-3 text-white"
              name="password"
              type="password"
              placeholder="Password *"
              autocomplete="off"
            />
            <ErrorMessage name="password" class="text-red-500" />
          </div>
          <div v-if="loading" class="button button-block bg-[#1ab188]">
            <Loading />
          </div>
          <button
            v-if="!loading"
            type="submit"
            class="button button-block bg-[#1ab188]"
          >
            Get Started
          </button>
        </Form>
      </div>
      <div class="text-red-500">{{ errMessage }}</div>

      <div v-if="!isShowRegister" id="login">
        <h1 class="text-2xl my-3 text-white">Welcome Back!</h1>

        <Form @submit="signinAccount">
          <div class="field-wrap">
            <Field
              v-model="dataLogin.email"
              placeholder="Email *"
              class="p-3 text-white"
              type="email"
              name="email"
              autocomplete="off"
            />
            <ErrorMessage name="email" class="text-red-500" />
          </div>

          <div class="field-wrap">
            <Field
              v-model="dataLogin.password"
              placeholder="Password *"
              class="p-3 text-white"
              type="password"
              name="password"
              autocomplete="off"
            />
            <ErrorMessage name="password" class="text-red-500" />
          </div>

          <router-link
            :to="{
              name: 'login',
            }"
            class="forgot my-4 text-white text-end flex justify-end"
            ><a href="#">Forgot Password?</a></router-link
          >

          <button class="button button-block">Log In</button>
        </Form>
      </div>
    </div>
    <!-- tab-content -->
  </div>
  <!-- /form -->
</template>

<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import AuthService from "@/services/auth.service";
import Loading from "@/components/Loading.vue";
import jwt_decode from "jwt-decode";
export default {
  components: {
    Form,
    Field,
    ErrorMessage,
    Loading: Loading,
  },

  data() {
    const dataRegister = yup.object().shape({
      firstName: yup
        .string()
        .required("Tên phải có giá trị.")
        .min(2, "Tên phải ít nhất 2 ký tự.")
        .max(50, "Tên có nhiều nhất 50 ký tự."),
      lastName: yup
        .string()
        .required("Tên phải có giá trị.")
        .min(2, "Tên phải ít nhất 2 ký tự.")
        .max(50, "Tên có nhiều nhất 50 ký tự."),
      email: yup
        .string()
        .required("Email bắt buộc phải nhập")
        .email("Email không hợp lệ"),
      password: yup
        .string()
        .required("Mật khẩu bắt buộc phải nhập")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
          "Mật khẩu phải 8 chữ số và ít nhất có 1 chữ hoa, 1 chữ thường, 1 kí tự đặt biệt,1 số"
        ),
    });
    return {
      loading: false,
      isShowRegister: true,
      messageSuccess: "",
      errMessage: "",
      dataRegister,
      dataLogin: {
        email: "",
        password: "",
      },
    };
  },
  methods: {
    showTabFormLogin() {
      this.isShowRegister = false;
    },
    showTabFormRegister() {
      this.isShowRegister = true;
    },
    async signupAccount() {
      const data = {
        firstName: this.dataRegister.firstName,
        lastName: this.dataRegister.lastName,
        email: this.dataRegister.email,
        password: this.dataRegister.password,
      };
      try {
        this.loading = true;
        const response = await AuthService.register(data);
        if (response.status === 200) {
          console.log(response);
          this.messageSuccess = "Đăng kí thành công!";
          this.loading = false;
        }
      } catch (e) {
        this.loading = false;
        this.messageSuccess = "Đăng kí thất bại!";

        console.log(e);
      }
    },
    async signinAccount() {
      try {
        const data = {
          email: this.dataLogin.email,
          password: this.dataLogin.password,
        };
        console.log(data);
        this.loading = true;
        const response = await AuthService.login(data);
        if (response.status === 200) {
          console.log(response);
          this.errMessage = "";

          this.loading = false;
          const accessToken = response.data.accessToken;
          localStorage.setItem("access_token", accessToken);
          // //decode lay thong tin payload
          var decodedPayload = jwt_decode(accessToken);
          console.log(decodedPayload);
          this.$store.dispatch("auth/handleSetUser", decodedPayload);
          if (decodedPayload.role === "admin") {
            this.$router.push({ name: "/admin/dashboard" });
          } else {
            this.$router.push({ name: "home" });
          }
        }
      } catch (e) {
        console.log(e);

        if (e.response.status === 400) {
          this.errMessage = e.response.data;
        }
      }
    },
  },
};
</script>

<style scope>
*,
*:before,
*:after {
  box-sizing: border-box;
}

html {
  overflow-y: scroll;
}

body {
  background: #c1bdba;
  font-family: "Titillium Web", sans-serif;
}

a {
  text-decoration: none;
  color: #1ab188;
  transition: 0.5s ease;
}
a:hover {
  color: #179b77;
}

.form {
  background: rgba(19, 35, 47, 0.9);
  padding: 40px;
  max-width: 600px;
  margin: 40px auto;
  border-radius: 4px;
  box-shadow: 0 4px 10px 4px rgba(19, 35, 47, 0.3);
}

.tab-group {
  list-style: none;
  padding: 0;
  margin: 0 0 40px 0;
}
.tab-group:after {
  content: "";
  display: table;
  clear: both;
}
.tab-group li a {
  display: block;
  text-decoration: none;
  padding: 15px;
  background: rgba(160, 179, 176, 0.25);
  color: #a0b3b0;
  font-size: 20px;
  float: left;
  width: 50%;
  text-align: center;
  cursor: pointer;
  transition: 0.5s ease;
}
.tab-group li a:hover {
  background: #179b77;
  color: #ffffff;
}
.tab-group .active a {
  background: #1ab188;
  color: #ffffff;
}

/* .tab-content > div:last-child {
  display: none;
} */

h1 {
  text-align: center;
  color: #ffffff;
  font-weight: 300;
  margin: 0 0 40px;
}

label {
  position: absolute;
  transform: translateY(6px);
  left: 13px;
  color: rgba(255, 255, 255, 0.5);
  transition: all 0.25s ease;
  -webkit-backface-visibility: hidden;
  pointer-events: none;
  font-size: 22px;
}
label .req {
  margin: 2px;
  color: #1ab188;
}

label.active {
  transform: translateY(50px);
  left: 2px;
  font-size: 14px;
}
label.active .req {
  opacity: 0;
}

label.highlight {
  color: #ffffff;
}

input,
textarea {
  font-size: 22px;
  display: block;
  width: 100%;
  height: 100%;
  padding: 5px 10px;
  background: none;
  background-image: none;
  border: 1px solid #a0b3b0;
  color: #ffffff;
  border-radius: 0;
  transition: border-color 0.25s ease, box-shadow 0.25s ease;
}
input:focus,
textarea:focus {
  outline: 0;
  border-color: #1ab188;
}

textarea {
  border: 2px solid #a0b3b0;
  resize: vertical;
}

.field-wrap {
  position: relative;
  margin-bottom: 40px;
}

.top-row:after {
  content: "";
  display: table;
  clear: both;
}
.top-row > div {
  float: left;
  width: 48%;
  margin-right: 4%;
}
.top-row > div:last-child {
  margin: 0;
}

.button {
  border: 0;
  outline: none;
  border-radius: 0;
  padding: 15px 0;
  font-size: 2rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  background: #1ab188;
  color: #ffffff;
  transition: all 0.5s ease;
  -webkit-appearance: none;
}
.button:hover,
.button:focus {
  background: #179b77;
}

.button-block {
  display: block;
  width: 100%;
}

.forgot {
  margin-top: -20px;
  text-align: right;
}
</style>
