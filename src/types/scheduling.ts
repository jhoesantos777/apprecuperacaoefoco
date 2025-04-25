
export interface Professional {
  id: string;
  name: string;
  specialty: string;
  bio?: string;
  image_url?: string;
  hourly_rate: number;
  created_at?: string;
}

export interface AvailableSlot {
  id: string;
  professional_id: string;
  date: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
  created_at?: string;
}

export interface Appointment {
  id: string;
  user_id: string;
  professional_id: string;
  slot_id: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  status: string;
  payment_status: string;
  payment_amount: number;
  payment_id?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  professionals?: Professional;
}
