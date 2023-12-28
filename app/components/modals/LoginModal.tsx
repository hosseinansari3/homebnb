"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { signIn } from "next-auth/react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { AiFillGithub } from "react-icons/ai";
import { useRouter } from "next/navigation";

import useRegisterModal from "@/app/hooks/useRegisterModal";
import useLoginModal from "@/app/hooks/useLoginModal";

import Modal from "./Modal";
import Input from "../inputs/Input";
import Heading from "../Heading";
import Button from "../Button";
import useCompleteProfilerModal from "@/app/hooks/useCompleteProfileModal";
import getCurrentUser from "@/app/actions/getCurrentUser";

const LoginModal = ({ currentUser }) => {
  const router = useRouter();
  const loginModal = useLoginModal();
  const completeProfileModal = useCompleteProfilerModal();

  const registerModal = useRegisterModal();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (currentUser && currentUser?.image == undefined) {
      completeProfileModal.onOpen();
    }
  }, [currentUser]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    signIn("credentials", {
      ...data,
      redirect: false,
    }).then((callback) => {
      setIsLoading(false);

      if (callback?.ok) {
        toast.success("وارد شدید");
        router.refresh();
        loginModal.onClose();
      }

      if (callback?.error) {
        toast.error(callback.error);
      }
    });
  };

  const onToggle = useCallback(() => {
    loginModal.onClose();
    registerModal.onOpen();
  }, [loginModal, registerModal]);

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading title="ورود" subtitle="ورود به حساب کاربری" />
      <Input
        id="email"
        label="ایمیل"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Input
        id="password"
        label="گذرواژه"
        type="password"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
    </div>
  );

  const footerContent = (
    <div className="flex flex-col gap-4 mt-3">
      <hr />
      <Button
        outline
        label="ورود با گوگل"
        icon={FcGoogle}
        onClick={() => signIn("google")}
      />
      <Button
        outline
        label="ورود با گیت هاب"
        icon={AiFillGithub}
        onClick={() => signIn("github")}
      />
      <div
        className="
      text-neutral-500 text-center mt-4 font-light"
      >
        <p>
          حساب کاربری ندارید؟
          <span
            onClick={onToggle}
            className="
              text-neutral-800
              cursor-pointer 
              hover:underline
            "
          >
            {" "}
            ساخت حساب کاربری
          </span>
        </p>
      </div>
    </div>
  );

  return (
    <Modal
      disabled={isLoading}
      isOpen={loginModal.isOpen}
      title="ورود"
      actionLabel="ادامه"
      onClose={loginModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
    />
  );
};

export default LoginModal;
