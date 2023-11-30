"use client";

import axios from "axios";
import { AiFillGithub } from "react-icons/ai";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

import useLoginModal from "@/app/hooks/useLoginModal";
import useRegisterModal from "@/app/hooks/useRegisterModal";

import Modal from "./Modal";
import Input from "../inputs/Input";
import Heading from "../Heading";
import Button from "../Button";
import { IoPersonAddOutline } from "react-icons/io5";

const CompleteProfileModal = () => {
  const registerModal = useRegisterModal();
  const loginModal = useLoginModal();

  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState([]);
  const [photo, setPhoto] = useState(null);
  const [name, setName] = useState(null);

  useEffect(() => {
    photo && setPreview(URL.createObjectURL(photo));
  }, [photo]);

  useEffect(() => {
    console.log("name", name);
  }, [name]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", photo);
    formData.append("name", name);

    axios
      .post("/api/completeProfile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        if (res.data.status == 201) {
          toast.success(res.data.Message);
          registerModal.onClose();
        } else {
          toast.error(res.error);
        }
      })
      .catch((error) => {
        toast.error(error.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const onToggle = useCallback(() => {
    registerModal.onClose();
    loginModal.onOpen();
  }, [registerModal, loginModal]);

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading title="Welcome to Airbnb" subtitle="Create an account!" />
      <Input
        id="email"
        label="ایمیل"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
        setInput={(name: any) => setName(name)}
      />
      <div className="justify-center items-center relative flex border-2 border-zinc-300 rounded-full w-36 h-36 m-auto">
        <img
          src={preview}
          className="rounded-full h-full w-full object-cover"
        />
        <input
          onChange={(e) => {
            setPhoto(e.target.files[0]);
          }}
          id="file"
          type="file"
          className="hidden"
        />
        <label
          for="file"
          className="flex text-zinc-300 justify-center items-center text-[40pt] absolute rounded-full w-full h-full cursor-pointer"
        >
          {" "}
          {photo == null && <IoPersonAddOutline />}
        </label>
      </div>
    </div>
  );

  return (
    <Modal
      disabled={isLoading}
      isOpen={registerModal.isOpen}
      title="Register"
      actionLabel="Continue"
      onClose={registerModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
    />
  );
};

export default CompleteProfileModal;
