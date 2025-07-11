import { createRouter, createWebHistory } from "vue-router";
import LandingView from "@/views/LandingView.vue";
import BooksListView from "@/views/BooksListView.vue";
import ThreadsListView from "@/views/ThreadsListView.vue";
import LoginView from "@/views/LoginView.vue";
import SignUpView from "@/views/SignUpView.vue";
import BookDetailView from "@/views/BookDetailView.vue";
import ThreadFormView from "@/views/ThreadFormView.vue";
import ThreadDetailView from "@/views/ThreadDetailView.vue";
import MyPageView from "@/views/MyPageView.vue";
import PasswordChangeView from "@/views/PasswordChangeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/", name: "main", component: LandingView },
    {
      path: "/books/:bookId",
      name: "bookDetail",
      component: BookDetailView,
      props: true,
    },
    { path: "/books", name: "bookList", component: BooksListView },
    { path: "/threads", name: "threadList", component: ThreadsListView },
    {
      path: "/threads/:threadId",
      name: "threadDetail",
      component: ThreadDetailView,
    },
    { path: "/mypage", name: "myPage", component: MyPageView },
    {
      path: "/mypage/password",
      name: "passwordChange",
      component: PasswordChangeView,
    },
    { path: "/login", name: "login", component: LoginView },
    { path: "/signup", name: "signup", component: SignUpView },
    {
      path: "/:bookId/threads/form",
      name: "threadForm",
      component: ThreadFormView,
    },
  ],
});

export default router;
