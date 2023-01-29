<template>
  <div>
    <h2 class="text-center w-full uppercase">Danh sách tài khoản</h2>
    <div class="card-body">
      <table class="table table-bordered">
        <thead>
          <tr>
            <th style="width: 10px">#</th>
            <th>FirstName</th>
            <th>LastName</th>

            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { reactive, ref } from "@vue/reactivity";
import axios from "axios";
import UserService from "@/services/user.service";
import { useRoute, useRouter } from "vue-router";
export default {
  setup() {
    const accounts = ref([]);
    const route = useRoute();
    const router = useRouter();
    const fetchAccouts = async () => {
      try {
        const response = await UserService.getPagination();
        console.log(response);
      } catch (e) {
        console.log(e);
        if (e.response.status === 401) {
          console.log("adasdas");
          router.push({ name: "login" });
        }
      }
    };
    fetchAccouts();
    return { accounts };
  },
};
</script>
