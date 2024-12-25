"use client";

import { FormEvent, useState } from "react";
import { useFormState } from "react-dom";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { submitContent } from "@/actions/content-action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

// Predefined options
const PREDEFINED_TAGS = ["ABAP", "SAP", "Programming", "Enterprise"];
const PREDEFINED_LIBS = ["ABAP", "SAP HANA", "SAP UI5", "NetWeaver"];

interface ContentSubmissionFormProps {
  initialTags: string[];
  initialLibraries: string[];
}

export default function ContentSubmissionForm({
  initialTags = PREDEFINED_TAGS,
  initialLibraries = PREDEFINED_LIBS,
}: ContentSubmissionFormProps) {
  const router = useRouter();
  const [tags, setTags] = useState<string[]>([]);
  const [libs, setLibs] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState("");
  const [customLib, setCustomLib] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [state, dispatch] = useFormState(submitContent, {
    message: "",
    success: false,
  });

  const addTag = (tag: string) => {
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setCustomTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const addLib = (lib: string) => {
    if (lib && !libs.includes(lib)) {
      setLibs([...libs, lib]);
      setCustomLib("");
    }
  };

  const removeLib = (libToRemove: string) => {
    setLibs(libs.filter((lib) => lib !== libToRemove));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // 校验输入值的有效性
    // if (!customTag || !customLib) {
    //   alert('请填写所有必填字段');
    //   return;
    // }

    setIsSubmitting(true);
    try {
      const formData = new FormData(event.currentTarget);

      // 校验值
      if (!formData.get("title") || !formData.get("slug") || !formData.get("content")) {
        console.error("提交失败:缺少必填字段");
        setIsSubmitting(false);
        return;
      }

      // 添加 tags 和 libs 到 formData
      tags.forEach((tag) => formData.append("tags", tag));
      libs.forEach((lib) => formData.append("libs", lib));

      // 调用 server action
      dispatch(formData);
      console.log(state, state.success);
      if (state.success) {
        router.push("/");
        router.refresh();
      }
      // router.push("/");
      // router.refresh();
    } catch (error) {
      console.error("提交失败:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 mt-8">Submit Content</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title Input */}
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            placeholder="Enter content title"
            disabled={isSubmitting}
          />
        </div>

        {/* Slug Input */}
        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            name="slug"
            placeholder="Enter URL-friendly slug"
            disabled={isSubmitting}
          />
        </div>

        {/* Content Textarea */}
        <div className="space-y-2">
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            name="content"
            placeholder="Enter your content here..."
            className="min-h-[200px]"
            disabled={isSubmitting}
          />
        </div>

        {/* Tags Multi-Select */}
        <div className="space-y-2">
          <Label>Tags</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="flex items-center"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-2"
                  disabled={isSubmitting}
                >
                  <X size={16} />
                </button>
              </Badge>
            ))}
          </div>

          <div className="flex gap-2">
            <Select onValueChange={addTag} disabled={isSubmitting}>
              <SelectTrigger>
                <SelectValue placeholder="Select a tag" />
              </SelectTrigger>
              <SelectContent>
                {initialTags.map((tag) => (
                  <SelectItem key={tag} value={tag}>
                    {tag}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex-grow">
              <Input
                placeholder="Or add custom tag"
                value={customTag}
                onChange={(e) => setCustomTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag(customTag);
                  }
                }}
                disabled={isSubmitting}
              />
            </div>
          </div>
        </div>

        {/* Libraries Multi-Select */}
        <div className="space-y-2">
          <Label>Libraries</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {libs.map((lib) => (
              <Badge
                key={lib}
                variant="secondary"
                className="flex items-center"
              >
                {lib}
                <button
                  type="button"
                  onClick={() => removeLib(lib)}
                  className="ml-2"
                  disabled={isSubmitting}
                >
                  <X size={16} />
                </button>
              </Badge>
            ))}
          </div>

          <div className="flex gap-2">
            <Select onValueChange={addLib} disabled={isSubmitting}>
              <SelectTrigger>
                <SelectValue placeholder="Select a library" />
              </SelectTrigger>
              <SelectContent>
                {initialLibraries.map((lib) => (
                  <SelectItem key={lib} value={lib}>
                    {lib}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex-grow">
              <Input
                placeholder="Or add custom library"
                value={customLib}
                onChange={(e) => setCustomLib(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addLib(customLib);
                  }
                }}
                disabled={isSubmitting}
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit"
          )}
        </Button>

        {/* Status Message */}
        {state.message && (
          <div
            className={`p-4 rounded-lg ${
              state.success
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {state.message}
          </div>
        )}
      </form>
    </div>
  );
}
