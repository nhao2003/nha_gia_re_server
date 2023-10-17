export interface IOtp {
    id: string;
    user_id: string;
    token: string;
    issued_at: Date;
    expiration_time: Date;
    is_used: boolean;
    is_active: boolean;
    }