"use client";

import axios from "axios";
import { toast } from "react-hot-toast";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import useRentModal from "@/app/hooks/useRentModal";

import Modal from "./Modal";
import Counter from "../inputs/Counter";
import CountrySelect from "../inputs/CountrySelect";
import { categories } from "../navbar/Categories";
import ImageUpload from "../inputs/ImageUpload";
import Input from "../inputs/Input";
import Heading from "../Heading";
import CategoryInput from "../inputs/CategoryInput";
import { LuImagePlus } from "react-icons/lu";

enum STEPS {
  CATEGORY = 0,
  LOCATION = 1,
  INFO = 2,
  IMAGES = 3,
  DESCRIPTION = 4,
  PRICE = 5,
}

const RentModal = () => {
  const [step, setStep] = useState(STEPS.CATEGORY);
  const [isLoading, setIsLoading] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState([]);

  useEffect(() => {
    photo && setPreview(URL.createObjectURL(photo));
  }, [photo]);
  const router = useRouter();

  const rentModal = useRentModal();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      category: "",
      location: null,
      guestCount: 1,
      roomCount: 1,
      bathroomCount: 1,
      imageFile: "",
      price: 1,
      title: "",
      description: "",
    },
  });

  const category = watch("category");
  const title = watch("title");
  const description = watch("description");
  const price = watch("price");

  const location = watch("location");
  const guestCount = watch("guestCount");
  const roomCount = watch("roomCount");
  const bathroomCount = watch("bathroomCount");
  const imageFile = watch("imageFile");

  const Map = useMemo(
    () =>
      dynamic(() => import("../Map"), {
        ssr: false,
      }),
    [location]
  );

  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const onBack = () => {
    setStep((value) => value - 1);
  };

  const onNext = () => {
    setStep((value) => value + 1);
  };

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    if (step !== STEPS.PRICE) {
      return onNext();
    }

    console.log("data", data);

    setIsLoading(true);

    const formData = new FormData();
    formData.append("category", category);
    formData.append("location", JSON.stringify(location));
    formData.append("guestCount", guestCount);
    formData.append("roomCount", roomCount);
    formData.append("bathroomCount", bathroomCount);
    formData.append("imageFile", imageFile);
    formData.append("title", title);
    formData.append("price", price);
    formData.append("description", description);

    axios
      .post("/api/listings", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(() => {
        toast.success("ملک شما اضافه شد!");
        router.refresh();
        reset();
        setStep(STEPS.CATEGORY);
        rentModal.onClose();
      })
      .catch(() => {
        toast.error("خطایی رخ داد");
      })
      .finally(() => {
        setIsLoading(false);
        setPreview([]);
        setPhoto(null);
      });
  };

  const actionLabel = useMemo(() => {
    if (step === STEPS.PRICE) {
      return "قرار دادن";
    }

    return "بعدی";
  }, [step]);

  const secondaryActionLabel = useMemo(() => {
    if (step === STEPS.CATEGORY) {
      return undefined;
    }

    return "قبلی";
  }, [step]);

  let bodyContent = (
    <div className="flex flex-col gap-8">
      <Heading
        title="نوع ملک خود را مشخص کنید"
        subtitle="یک دسته بندی را انتخاب کنید"
      />
      <div
        className="
          grid 
          grid-cols-1 
          md:grid-cols-2 
          gap-3
          max-h-[40vh]
          overflow-y-auto
        "
      >
        {categories.map((item) => (
          <div key={item.label} className="col-span-1">
            <CategoryInput
              onClick={(category) => setCustomValue("category", category)}
              selected={category === item.label}
              label={item.label}
              icon={item.icon}
            />
          </div>
        ))}
      </div>
    </div>
  );

  if (step === STEPS.LOCATION) {
    bodyContent = (
      <div className="flex flex-col gap-4">
        <Heading
          title="مکان ملک خود را انتخاب کنید"
          subtitle="ملکتان در کدام شهر است؟"
        />
        <CountrySelect
          value={location}
          onChange={(value) => {
            setCustomValue("location", value);
            console.log("value", value);
          }}
        />
        <Map center={location?.latlng} />
      </div>
    );
  }

  if (step === STEPS.INFO) {
    bodyContent = (
      <div className="flex flex-col gap-4">
        <Heading
          title="اطلاعات ملک خود را ارائه دهید"
          subtitle="ملکتان چه امکاناتی دارد؟"
        />
        <Counter
          onChange={(value) => setCustomValue("guestCount", value)}
          value={guestCount}
          title="مسافران"
          subtitle="اجازه اقامت چند نفر را می دهید؟"
        />
        <hr />
        <Counter
          onChange={(value) => setCustomValue("roomCount", value)}
          value={roomCount}
          title="اتاق ها"
          subtitle="ملکتان چند اتاق دارد؟"
        />
        <hr />
        <Counter
          onChange={(value) => setCustomValue("bathroomCount", value)}
          value={bathroomCount}
          title="سرویس بهداشتی"
          subtitle="ملکتان چند سرویس بهداشتی دارد؟"
        />
      </div>
    );
  }

  if (step === STEPS.IMAGES) {
    bodyContent = (
      <div className="flex flex-col gap-4">
        <Heading
          title="عکس ملک خود را اضافه کنید"
          subtitle="ملکتان را برای مسافران به نمایش بگذارید!"
        />
        <div className="relative flex justify-center items-center text-[80px] text-zinc-300 border-dotted border-[3px] border-zinc-300 h-56 w-[400px] m-auto rounded-3xl">
          {photo == null ? (
            <LuImagePlus />
          ) : (
            <img
              src={preview}
              className="h-full w-full object-cover rounded-3xl"
            />
          )}

          <input
            onChange={(e) => {
              setPhoto(e.target.files[0]);
              setCustomValue("imageFile", e.target.files[0]);
            }}
            id="img"
            type="file"
            className="hidden"
          />

          <label
            for="img"
            className="w-full h-full cursor-pointer absolute"
          ></label>
        </div>
      </div>
    );
  }

  if (step === STEPS.DESCRIPTION) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="ملکتان را توصیف کنید"
          subtitle="یک توصیف کوتاه و مفید بنویسید"
        />
        <Input
          key={0}
          id="title"
          label="عنوان"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
        <hr />
        <Input
          key={1}
          id="description"
          label="توضیحات"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
      </div>
    );
  }

  if (step === STEPS.PRICE) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="قیمت خود را تعیین کنید"
          subtitle="هزینه اسکان به ازای هر شب را تعیین کنید"
        />
        <Input
          id="price"
          label="قیمت"
          formatPrice
          key={2}
          type="number"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
      </div>
    );
  }

  return (
    <Modal
      isOpen={rentModal.isOpen}
      title="ملک خود را اجاره دهید"
      body={bodyContent}
      actionLabel={actionLabel}
      secondaryActionLabel={secondaryActionLabel}
      secondaryAction={step === STEPS.CATEGORY ? undefined : onBack}
      onSubmit={handleSubmit(onSubmit)}
      onClose={rentModal.onClose}
    />
  );
};

export default RentModal;
