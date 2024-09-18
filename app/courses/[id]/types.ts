export interface Video {
  id: number;
  title: string;
  course_id: string;
  duration: number;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  total_duration: number;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
}
