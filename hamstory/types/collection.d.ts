export interface User {
  _id: string;
  nickname: string;
  email: string;
  password: string;
  profile_image_public_id: string;
  profile_image_url: string;
  blog_id: string;
}

export interface Blog {
  _id: string;
  user_id: string;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface BlogCategory {
  _id: string;
  blog_id: string;
  name: string;
  created_at: string;
  updated_at: string;
}
