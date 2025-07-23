import { atom } from "jotai";

export const isLogin = atom(localStorage.getItem("id") ? true : false);