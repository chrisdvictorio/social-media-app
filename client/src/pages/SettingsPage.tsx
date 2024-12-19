import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { countries } from "countries-list";
import toast from "react-hot-toast";

import { Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { User as UserType } from "@/types/user";
import axiosInstance from "@/api/axios";

type FormData = {
  avatar: string;
  cover: string;
  username: string;
  bio: string;
  email: string;
  country: string;
  birthday: string;
  password: string;
  confirmPassword: string;
};

const SettingsPage = () => {
  const [formData, setFormData] = useState({
    avatar: "",
    cover: "",
    username: "",
    bio: "",
    email: "",
    country: "",
    birthday: "",
    password: "",
    confirmPassword: "",
  });
  const countryNames = Object.values(countries).map((country) => country.name);
  const queryClient = useQueryClient();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    const file = files?.[0];

    if (file && name) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setFormData((prevData) => ({
          ...prevData,
          [name]: reader.result as string,
        }));
      };

      reader.readAsDataURL(file);
    }
  };

  const handleCancelClick = () => {
    setFormData({
      avatar: "",
      cover: "",
      username: "",
      bio: "",
      email: "",
      country: "",
      birthday: "",
      password: "",
      confirmPassword: "",
    });
  };

  const { mutate: updateUserMutation, isPending: isUpdating } = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await axiosInstance.patch("/users/update", formData);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      toast.success(data.message);
      setFormData({
        avatar: "",
        cover: "",
        username: "",
        bio: "",
        email: "",
        country: "",
        birthday: "",
        password: "",
        confirmPassword: "",
      });
    },
    onError: (error: any) => {
      toast.error(error.response.data.error);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateUserMutation(formData);
  };

  const { data: authUser } = useQuery<UserType>({ queryKey: ["authUser"] });
  return (
    <div className="max-w-7xl mx-auto px-4 2xl:px-0 flex-1 flex items-center justify-center mb-4">
      <div className="border rounded-lg shadow-lg">
        <div className="relative">
          <img
            alt={`${authUser?.username} cover`}
            src={formData.cover || authUser?.cover}
            className="object-cover h-[7.5rem] md:h-44 w-full rounded-lg"
          />
          <img
            alt={`${authUser?.username} cover`}
            src={formData.avatar || authUser?.avatar}
            className="object-cover rounded-full h-24 w-24 absolute -bottom-10 left-1/2 transform -translate-x-1/2 border-2"
          />
        </div>
        <form
          onSubmit={handleSubmit}
          autoComplete="off"
          className="p-4 mt-8 space-y-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-full">
              <label htmlFor="avatar" className="text-sm">
                Profile Picture
              </label>
              <div className="relative">
                <Button
                  type="button"
                  variant="outline"
                  className="flex items-center gap-2 w-full"
                  onClick={() => document.getElementById("avatar")?.click()}
                >
                  <p className="text-xs">Choose Profile Picture</p>
                </Button>

                <Input
                  id="avatar"
                  name="avatar"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            </div>
            <div className="w-full">
              <label htmlFor="cover" className="text-sm">
                Cover Photo
              </label>
              <div className="relative">
                <Button
                  type="button"
                  variant="outline"
                  className="flex items-center gap-2 w-full"
                  onClick={() => document.getElementById("cover")?.click()}
                >
                  <p className="text-xs">Choose Cover Photo</p>
                </Button>
                <Input
                  id="cover"
                  name="cover"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            </div>
          </div>
          <div>
            <label htmlFor="username" className="text-sm">
              Username
            </label>
            <Input
              id="username"
              name="username"
              type="text"
              placeholder={authUser?.username}
              value={formData.username}
              onChange={handleChange}
              className="placeholder:text-sm"
            />
          </div>
          <div>
            <label htmlFor="bio" className="text-sm">
              Bio
            </label>
            <Textarea
              id="bio"
              name="bio"
              rows={3}
              placeholder={authUser?.bio}
              value={formData.bio}
              onChange={handleChange}
              className="placeholder:text-sm"
            />
          </div>
          <div>
            <label htmlFor="email" className="text-sm">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder={authUser?.email}
              value={formData.email}
              onChange={handleChange}
              className="placeholder:text-sm"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="w-full">
              <label htmlFor="country" className="text-sm">
                Country
              </label>
              <Select
                value={formData.country}
                onValueChange={(value) => {
                  setFormData((prevData) => ({
                    ...prevData,
                    country: value,
                  }));
                }}
              >
                <SelectTrigger id="country" name="country" className="h-9">
                  <SelectValue placeholder={authUser?.country} />
                </SelectTrigger>
                <SelectContent>
                  {countryNames.map((name) => (
                    <SelectItem key={name} value={name}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full">
              <label htmlFor="birthday" className="text-sm">
                Birthday
              </label>
              <Input
                id="birthday"
                name="birthday"
                type="date"
                value={formData.birthday}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div>
              <label htmlFor="password" className="text-sm">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="•••••••••"
                value={formData.password}
                onChange={handleChange}
                className="placeholder:text-sm"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="text-sm">
                Confirm Password
              </label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="•••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="placeholder:text-sm"
              />
            </div>
          </div>
          <Separator />
          <div className="flex gap-4">
            <Button
              type="button"
              onClick={handleCancelClick}
              variant={"secondary"}
              className="w-full border"
            >
              Cancel
            </Button>

            <Button disabled={isUpdating} type="submit" className="w-full">
              {isUpdating ? (
                <>
                  <Loader className="animate-spin" />
                  <p>Updating profile...</p>
                </>
              ) : (
                <p>Edit Profile</p>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsPage;
