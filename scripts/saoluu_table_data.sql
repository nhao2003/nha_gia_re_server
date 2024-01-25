PGDMP                       |            nha_gia_re_postgres_yef0    15.5    16.0 E   S           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            T           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            U           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            V           1262    16389    nha_gia_re_postgres_yef0    DATABASE     �   CREATE DATABASE nha_gia_re_postgres_yef0 WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.UTF8';
 (   DROP DATABASE nha_gia_re_postgres_yef0;
             	   nnhao2003    false            W           0    0    nha_gia_re_postgres_yef0    DATABASE PROPERTIES     A   ALTER DATABASE nha_gia_re_postgres_yef0 SET "TimeZone" TO 'utc';
                  	   nnhao2003    false                        2615    2200    public    SCHEMA     2   -- *not* creating schema, since initdb creates it
 2   -- *not* dropping schema, since initdb creates it
             	   nnhao2003    false            X           0    0    SCHEMA public    COMMENT         COMMENT ON SCHEMA public IS '';
                	   nnhao2003    false    8            Y           0    0    SCHEMA public    ACL     +   REVOKE USAGE ON SCHEMA public FROM PUBLIC;
                	   nnhao2003    false    8                        3079    16496 	   adminpack 	   EXTENSION     A   CREATE EXTENSION IF NOT EXISTS adminpack WITH SCHEMA pg_catalog;
    DROP EXTENSION adminpack;
                   false            Z           0    0    EXTENSION adminpack    COMMENT     M   COMMENT ON EXTENSION adminpack IS 'administrative functions for PostgreSQL';
                        false    3                        3079    16873    unaccent 	   EXTENSION     <   CREATE EXTENSION IF NOT EXISTS unaccent WITH SCHEMA public;
    DROP EXTENSION unaccent;
                   false    8            [           0    0    EXTENSION unaccent    COMMENT     P   COMMENT ON EXTENSION unaccent IS 'text search dictionary that removes accents';
                        false    4                        3079    16445 	   uuid-ossp 	   EXTENSION     ?   CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;
    DROP EXTENSION "uuid-ossp";
                   false    8            \           0    0    EXTENSION "uuid-ossp"    COMMENT     W   COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';
                        false    2            ]           0    0 #   FUNCTION pg_file_rename(text, text)    ACL     J   GRANT ALL ON FUNCTION pg_catalog.pg_file_rename(text, text) TO nnhao2003;
       
   pg_catalog          postgres    false    263                       1255    16944    notify_data_insert()    FUNCTION     �   CREATE FUNCTION public.notify_data_insert() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  PERFORM pg_notify('data_inserted', row_to_json(NEW)::text);
  RETURN NEW;
END;
$$;
 +   DROP FUNCTION public.notify_data_insert();
       public       	   nnhao2003    false    8                       1255    17267    projects_trigger()    FUNCTION     �   CREATE FUNCTION public.projects_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
    new.document :=
        setweight(to_tsvector('simple', unaccent(new.project_name)), 'A');
    return new;
end
$$;
 )   DROP FUNCTION public.projects_trigger();
       public       	   nnhao2003    false    8                       1255    16883    real_estate_posts_trigger()    FUNCTION     @  CREATE FUNCTION public.real_estate_posts_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    begin
        new.document :=
            setweight(to_tsvector('simple', unaccent(new.title)), 'A') ||
            setweight(to_tsvector('simple', unaccent(new.description)), 'B');
        return new;
    end
    $$;
 2   DROP FUNCTION public.real_estate_posts_trigger();
       public       	   nnhao2003    false    8            ^           0    0    FUNCTION unaccent(text)    ACL     :   GRANT ALL ON FUNCTION public.unaccent(text) TO nnhao2003;
          public          postgres    false    266            _           0    0 &   FUNCTION unaccent(regdictionary, text)    ACL     I   GRANT ALL ON FUNCTION public.unaccent(regdictionary, text) TO nnhao2003;
          public          postgres    false    265            `           0    0     FUNCTION unaccent_init(internal)    ACL     C   GRANT ALL ON FUNCTION public.unaccent_init(internal) TO nnhao2003;
          public          postgres    false    267            a           0    0 @   FUNCTION unaccent_lexize(internal, internal, internal, internal)    ACL     c   GRANT ALL ON FUNCTION public.unaccent_lexize(internal, internal, internal, internal) TO nnhao2003;
          public          postgres    false    268            b           0    0    FUNCTION uuid_generate_v1()    ACL     >   GRANT ALL ON FUNCTION public.uuid_generate_v1() TO nnhao2003;
          public          postgres    false    246            c           0    0    FUNCTION uuid_generate_v1mc()    ACL     @   GRANT ALL ON FUNCTION public.uuid_generate_v1mc() TO nnhao2003;
          public          postgres    false    247            d           0    0 4   FUNCTION uuid_generate_v3(namespace uuid, name text)    ACL     W   GRANT ALL ON FUNCTION public.uuid_generate_v3(namespace uuid, name text) TO nnhao2003;
          public          postgres    false    248            e           0    0    FUNCTION uuid_generate_v4()    ACL     >   GRANT ALL ON FUNCTION public.uuid_generate_v4() TO nnhao2003;
          public          postgres    false    249            f           0    0 4   FUNCTION uuid_generate_v5(namespace uuid, name text)    ACL     W   GRANT ALL ON FUNCTION public.uuid_generate_v5(namespace uuid, name text) TO nnhao2003;
          public          postgres    false    250            g           0    0    FUNCTION uuid_nil()    ACL     6   GRANT ALL ON FUNCTION public.uuid_nil() TO nnhao2003;
          public          postgres    false    241            h           0    0    FUNCTION uuid_ns_dns()    ACL     9   GRANT ALL ON FUNCTION public.uuid_ns_dns() TO nnhao2003;
          public          postgres    false    242            i           0    0    FUNCTION uuid_ns_oid()    ACL     9   GRANT ALL ON FUNCTION public.uuid_ns_oid() TO nnhao2003;
          public          postgres    false    244            j           0    0    FUNCTION uuid_ns_url()    ACL     9   GRANT ALL ON FUNCTION public.uuid_ns_url() TO nnhao2003;
          public          postgres    false    243            k           0    0    FUNCTION uuid_ns_x500()    ACL     :   GRANT ALL ON FUNCTION public.uuid_ns_x500() TO nnhao2003;
          public          postgres    false    245            _           3602    16880 
   vietnamese    TEXT SEARCH CONFIGURATION     /  CREATE TEXT SEARCH CONFIGURATION public.vietnamese (
    PARSER = pg_catalog."default" );

ALTER TEXT SEARCH CONFIGURATION public.vietnamese
    ADD MAPPING FOR asciiword WITH simple;

ALTER TEXT SEARCH CONFIGURATION public.vietnamese
    ADD MAPPING FOR word WITH simple;

ALTER TEXT SEARCH CONFIGURATION public.vietnamese
    ADD MAPPING FOR numword WITH simple;

ALTER TEXT SEARCH CONFIGURATION public.vietnamese
    ADD MAPPING FOR email WITH simple;

ALTER TEXT SEARCH CONFIGURATION public.vietnamese
    ADD MAPPING FOR url WITH simple;

ALTER TEXT SEARCH CONFIGURATION public.vietnamese
    ADD MAPPING FOR host WITH simple;

ALTER TEXT SEARCH CONFIGURATION public.vietnamese
    ADD MAPPING FOR sfloat WITH simple;

ALTER TEXT SEARCH CONFIGURATION public.vietnamese
    ADD MAPPING FOR version WITH simple;

ALTER TEXT SEARCH CONFIGURATION public.vietnamese
    ADD MAPPING FOR hword_numpart WITH simple;

ALTER TEXT SEARCH CONFIGURATION public.vietnamese
    ADD MAPPING FOR hword_part WITH simple;

ALTER TEXT SEARCH CONFIGURATION public.vietnamese
    ADD MAPPING FOR hword_asciipart WITH simple;

ALTER TEXT SEARCH CONFIGURATION public.vietnamese
    ADD MAPPING FOR numhword WITH simple;

ALTER TEXT SEARCH CONFIGURATION public.vietnamese
    ADD MAPPING FOR asciihword WITH simple;

ALTER TEXT SEARCH CONFIGURATION public.vietnamese
    ADD MAPPING FOR hword WITH simple;

ALTER TEXT SEARCH CONFIGURATION public.vietnamese
    ADD MAPPING FOR url_path WITH simple;

ALTER TEXT SEARCH CONFIGURATION public.vietnamese
    ADD MAPPING FOR file WITH simple;

ALTER TEXT SEARCH CONFIGURATION public.vietnamese
    ADD MAPPING FOR "float" WITH simple;

ALTER TEXT SEARCH CONFIGURATION public.vietnamese
    ADD MAPPING FOR "int" WITH simple;

ALTER TEXT SEARCH CONFIGURATION public.vietnamese
    ADD MAPPING FOR uint WITH simple;
 2   DROP TEXT SEARCH CONFIGURATION public.vietnamese;
       public       	   nnhao2003    false    8            �            1259    17108    account_verification_requests    TABLE     I  CREATE TABLE public.account_verification_requests (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    is_verified boolean,
    reviewed_at timestamp without time zone,
    rejected_info text,
    user_id uuid,
    request_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    front_identity_card_image_link text,
    back_identity_card_image_link text,
    portrait_image_link text,
    full_name text,
    sex boolean,
    dob timestamp without time zone,
    identity_card_no text,
    identity_card_issued_date timestamp without time zone,
    issued_by text
);
 1   DROP TABLE public.account_verification_requests;
       public         heap 	   nnhao2003    false    2    8    8            l           0    0 '   COLUMN account_verification_requests.id    COMMENT     O   COMMENT ON COLUMN public.account_verification_requests.id IS 'Mã yêu cầu';
          public       	   nnhao2003    false    238            m           0    0 0   COLUMN account_verification_requests.is_verified    COMMENT     b   COMMENT ON COLUMN public.account_verification_requests.is_verified IS 'Tình trạng kiểm tra';
          public       	   nnhao2003    false    238            n           0    0 0   COLUMN account_verification_requests.reviewed_at    COMMENT     b   COMMENT ON COLUMN public.account_verification_requests.reviewed_at IS 'Ngày duyệt yêu cầu';
          public       	   nnhao2003    false    238            o           0    0 2   COLUMN account_verification_requests.rejected_info    COMMENT     ]   COMMENT ON COLUMN public.account_verification_requests.rejected_info IS 'Ngày từ chối';
          public       	   nnhao2003    false    238            p           0    0 ,   COLUMN account_verification_requests.user_id    COMMENT     X   COMMENT ON COLUMN public.account_verification_requests.user_id IS 'Mã người dùng';
          public       	   nnhao2003    false    238            q           0    0 1   COLUMN account_verification_requests.request_date    COMMENT     a   COMMENT ON COLUMN public.account_verification_requests.request_date IS 'Ngày gửi yêu cầu';
          public       	   nnhao2003    false    238            r           0    0 C   COLUMN account_verification_requests.front_identity_card_image_link    COMMENT     y   COMMENT ON COLUMN public.account_verification_requests.front_identity_card_image_link IS 'Ảnh ID Card mặt trước';
          public       	   nnhao2003    false    238            s           0    0 B   COLUMN account_verification_requests.back_identity_card_image_link    COMMENT     s   COMMENT ON COLUMN public.account_verification_requests.back_identity_card_image_link IS 'Ảnh ID Card mặt sau';
          public       	   nnhao2003    false    238            t           0    0 8   COLUMN account_verification_requests.portrait_image_link    COMMENT     b   COMMENT ON COLUMN public.account_verification_requests.portrait_image_link IS 'Ảnh chân dung';
          public       	   nnhao2003    false    238            u           0    0 .   COLUMN account_verification_requests.full_name    COMMENT     b   COMMENT ON COLUMN public.account_verification_requests.full_name IS 'Họ và tên đầy đủ';
          public       	   nnhao2003    false    238            v           0    0 (   COLUMN account_verification_requests.sex    COMMENT     N   COMMENT ON COLUMN public.account_verification_requests.sex IS 'Giới tính';
          public       	   nnhao2003    false    238            w           0    0 (   COLUMN account_verification_requests.dob    COMMENT     L   COMMENT ON COLUMN public.account_verification_requests.dob IS 'Ngày sinh';
          public       	   nnhao2003    false    238            x           0    0 5   COLUMN account_verification_requests.identity_card_no    COMMENT     Y   COMMENT ON COLUMN public.account_verification_requests.identity_card_no IS 'Số thẻ';
          public       	   nnhao2003    false    238            y           0    0 >   COLUMN account_verification_requests.identity_card_issued_date    COMMENT     c   COMMENT ON COLUMN public.account_verification_requests.identity_card_issued_date IS 'Ngày cấp';
          public       	   nnhao2003    false    238            z           0    0 .   COLUMN account_verification_requests.issued_by    COMMENT     R   COMMENT ON COLUMN public.account_verification_requests.issued_by IS 'Nơi cấp';
          public       	   nnhao2003    false    238            �            1259    16506    blogs    TABLE     v  CREATE TABLE public.blogs (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    title character varying(255) NOT NULL,
    short_description text NOT NULL,
    author character varying(50) NOT NULL,
    thumbnail text NOT NULL,
    content text NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);
    DROP TABLE public.blogs;
       public         heap 	   nnhao2003    false    2    8    8            {           0    0    TABLE blogs    COMMENT     A   COMMENT ON TABLE public.blogs IS 'Table for storing blog posts';
          public       	   nnhao2003    false    219            |           0    0    COLUMN blogs.id    COMMENT     1   COMMENT ON COLUMN public.blogs.id IS 'Mã blog';
          public       	   nnhao2003    false    219            }           0    0    COLUMN blogs.title    COMMENT     7   COMMENT ON COLUMN public.blogs.title IS 'Tiêu đề';
          public       	   nnhao2003    false    219            ~           0    0    COLUMN blogs.short_description    COMMENT     @   COMMENT ON COLUMN public.blogs.short_description IS 'Mô tả';
          public       	   nnhao2003    false    219                       0    0    COLUMN blogs.author    COMMENT     7   COMMENT ON COLUMN public.blogs.author IS 'Tác giả';
          public       	   nnhao2003    false    219            �           0    0    COLUMN blogs.thumbnail    COMMENT     ;   COMMENT ON COLUMN public.blogs.thumbnail IS 'Ảnh nền';
          public       	   nnhao2003    false    219            �           0    0    COLUMN blogs.content    COMMENT     8   COMMENT ON COLUMN public.blogs.content IS 'Nội dung';
          public       	   nnhao2003    false    219            �           0    0    COLUMN blogs.is_active    COMMENT     L   COMMENT ON COLUMN public.blogs.is_active IS 'Tình trạng hoạt động';
          public       	   nnhao2003    false    219            �           0    0    COLUMN blogs.created_at    COMMENT     <   COMMENT ON COLUMN public.blogs.created_at IS 'Ngày tạo';
          public       	   nnhao2003    false    219            �            1259    16522    conversations    TABLE     �   CREATE TABLE public.conversations (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    last_messsage_id uuid,
    is_active boolean DEFAULT true NOT NULL
);
 !   DROP TABLE public.conversations;
       public         heap 	   nnhao2003    false    2    8    8            �           0    0    COLUMN conversations.id    COMMENT     I   COMMENT ON COLUMN public.conversations.id IS 'Mã cuộc trò chuyện';
          public       	   nnhao2003    false    220            �           0    0    COLUMN conversations.created_at    COMMENT     D   COMMENT ON COLUMN public.conversations.created_at IS 'Ngày tạo';
          public       	   nnhao2003    false    220            �           0    0 %   COLUMN conversations.last_messsage_id    COMMENT     Z   COMMENT ON COLUMN public.conversations.last_messsage_id IS 'Mã tin nhắn cuối cùng';
          public       	   nnhao2003    false    220            �           0    0    COLUMN conversations.is_active    COMMENT     T   COMMENT ON COLUMN public.conversations.is_active IS 'Tình trạng hoạt động';
          public       	   nnhao2003    false    220            �            1259    16528 
   developers    TABLE     ,  CREATE TABLE public.developers (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    description text NOT NULL,
    images text[] NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    name character varying(50) NOT NULL
);
    DROP TABLE public.developers;
       public         heap 	   nnhao2003    false    2    8    8            �           0    0    COLUMN developers.id    COMMENT     A   COMMENT ON COLUMN public.developers.id IS 'Mã nhà đầu tư';
          public       	   nnhao2003    false    221            �           0    0    COLUMN developers.description    COMMENT     ?   COMMENT ON COLUMN public.developers.description IS 'Mô tả';
          public       	   nnhao2003    false    221            �           0    0    COLUMN developers.images    COMMENT     7   COMMENT ON COLUMN public.developers.images IS 'Ảnh';
          public       	   nnhao2003    false    221            �           0    0    COLUMN developers.created_at    COMMENT     A   COMMENT ON COLUMN public.developers.created_at IS 'Ngày tạo';
          public       	   nnhao2003    false    221            �           0    0    COLUMN developers.is_active    COMMENT     Q   COMMENT ON COLUMN public.developers.is_active IS 'Tình trạng hoạt động';
          public       	   nnhao2003    false    221            �           0    0    COLUMN developers.name    COMMENT     D   COMMENT ON COLUMN public.developers.name IS 'Tên nhà đầu tư';
          public       	   nnhao2003    false    221            �            1259    16536    discount_codes    TABLE     !  CREATE TABLE public.discount_codes (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    package_id uuid NOT NULL,
    discount_percent double precision NOT NULL,
    starting_date timestamp without time zone NOT NULL,
    expiration_date timestamp without time zone NOT NULL,
    description text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    limited_quantity integer,
    code character varying(50) NOT NULL,
    min_subscription_months integer DEFAULT 1
);
 "   DROP TABLE public.discount_codes;
       public         heap 	   nnhao2003    false    2    8    8            �           0    0    COLUMN discount_codes.id    COMMENT     A   COMMENT ON COLUMN public.discount_codes.id IS 'Mã giảm giá';
          public       	   nnhao2003    false    222            �           0    0     COLUMN discount_codes.package_id    COMMENT     N   COMMENT ON COLUMN public.discount_codes.package_id IS 'Mã gói dịch vụ';
          public       	   nnhao2003    false    222            �           0    0 &   COLUMN discount_codes.discount_percent    COMMENT     X   COMMENT ON COLUMN public.discount_codes.discount_percent IS 'Phần trăm giảm giá';
          public       	   nnhao2003    false    222            �           0    0 #   COLUMN discount_codes.starting_date    COMMENT     O   COMMENT ON COLUMN public.discount_codes.starting_date IS 'Ngày bắt đầu';
          public       	   nnhao2003    false    222            �           0    0 %   COLUMN discount_codes.expiration_date    COMMENT     P   COMMENT ON COLUMN public.discount_codes.expiration_date IS 'Ngày kết thúc';
          public       	   nnhao2003    false    222            �           0    0 !   COLUMN discount_codes.description    COMMENT     C   COMMENT ON COLUMN public.discount_codes.description IS 'Mô tả';
          public       	   nnhao2003    false    222            �           0    0     COLUMN discount_codes.created_at    COMMENT     E   COMMENT ON COLUMN public.discount_codes.created_at IS 'Ngày tạo';
          public       	   nnhao2003    false    222            �           0    0    COLUMN discount_codes.is_active    COMMENT     U   COMMENT ON COLUMN public.discount_codes.is_active IS 'Tình trạng hoạt động';
          public       	   nnhao2003    false    222            �           0    0 &   COLUMN discount_codes.limited_quantity    COMMENT     Y   COMMENT ON COLUMN public.discount_codes.limited_quantity IS 'Số lượng sử dụng';
          public       	   nnhao2003    false    222            �           0    0    COLUMN discount_codes.code    COMMENT     <   COMMENT ON COLUMN public.discount_codes.code IS 'Mã code';
          public       	   nnhao2003    false    222            �           0    0 -   COLUMN discount_codes.min_subscription_months    COMMENT     g   COMMENT ON COLUMN public.discount_codes.min_subscription_months IS 'Số tháng đăng tối thiểu';
          public       	   nnhao2003    false    222            �            1259    16544    membership_packages    TABLE     �  CREATE TABLE public.membership_packages (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(50) NOT NULL,
    description text NOT NULL,
    price_per_month bigint NOT NULL,
    monthly_post_limit integer NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    display_priority_point integer DEFAULT 0 NOT NULL,
    post_approval_priority_point integer NOT NULL
);
 '   DROP TABLE public.membership_packages;
       public         heap 	   nnhao2003    false    2    8    8            �           0    0    COLUMN membership_packages.id    COMMENT     K   COMMENT ON COLUMN public.membership_packages.id IS 'Mã gói dịch vụ';
          public       	   nnhao2003    false    223            �           0    0    COLUMN membership_packages.name    COMMENT     N   COMMENT ON COLUMN public.membership_packages.name IS 'Tên gói dịch vụ';
          public       	   nnhao2003    false    223            �           0    0 &   COLUMN membership_packages.description    COMMENT     H   COMMENT ON COLUMN public.membership_packages.description IS 'Mô tả';
          public       	   nnhao2003    false    223            �           0    0 *   COLUMN membership_packages.price_per_month    COMMENT     [   COMMENT ON COLUMN public.membership_packages.price_per_month IS 'Giá trên một tháng';
          public       	   nnhao2003    false    223            �           0    0 -   COLUMN membership_packages.monthly_post_limit    COMMENT     q   COMMENT ON COLUMN public.membership_packages.monthly_post_limit IS 'Số bài đăng giới hạn trên tháng';
          public       	   nnhao2003    false    223            �           0    0 $   COLUMN membership_packages.is_active    COMMENT     Z   COMMENT ON COLUMN public.membership_packages.is_active IS 'Tình trạng hoạt động';
          public       	   nnhao2003    false    223            �           0    0 %   COLUMN membership_packages.created_at    COMMENT     J   COMMENT ON COLUMN public.membership_packages.created_at IS 'Ngày tạo';
          public       	   nnhao2003    false    223            �           0    0 1   COLUMN membership_packages.display_priority_point    COMMENT     }   COMMENT ON COLUMN public.membership_packages.display_priority_point IS 'Điểm ưu tiên hiển thị tin được cộng';
          public       	   nnhao2003    false    223            �           0    0 7   COLUMN membership_packages.post_approval_priority_point    COMMENT     t   COMMENT ON COLUMN public.membership_packages.post_approval_priority_point IS 'Số điểm ưu tiên duyệt bài';
          public       	   nnhao2003    false    223            �            1259    16553    messages    TABLE     S  CREATE TABLE public.messages (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    conversation_id uuid NOT NULL,
    sender_id uuid NOT NULL,
    content_type character varying(50) NOT NULL,
    content jsonb NOT NULL,
    sent_at timestamp without time zone DEFAULT now() NOT NULL,
    is_active boolean DEFAULT true NOT NULL
);
    DROP TABLE public.messages;
       public         heap 	   nnhao2003    false    2    8    8            �           0    0    COLUMN messages.id    COMMENT     :   COMMENT ON COLUMN public.messages.id IS 'Mã tin nhắn';
          public       	   nnhao2003    false    224            �           0    0    COLUMN messages.conversation_id    COMMENT     Q   COMMENT ON COLUMN public.messages.conversation_id IS 'Mã cuộc trò chuyện';
          public       	   nnhao2003    false    224            �           0    0    COLUMN messages.sender_id    COMMENT     E   COMMENT ON COLUMN public.messages.sender_id IS 'Mã người gửi';
          public       	   nnhao2003    false    224            �           0    0    COLUMN messages.content_type    COMMENT     R   COMMENT ON COLUMN public.messages.content_type IS 'Loại nội dung tin nhắn';
          public       	   nnhao2003    false    224            �           0    0    COLUMN messages.content    COMMENT     ;   COMMENT ON COLUMN public.messages.content IS 'Nội dung';
          public       	   nnhao2003    false    224            �           0    0    COLUMN messages.sent_at    COMMENT     <   COMMENT ON COLUMN public.messages.sent_at IS 'Ngày gửi';
          public       	   nnhao2003    false    224            �           0    0    COLUMN messages.is_active    COMMENT     O   COMMENT ON COLUMN public.messages.is_active IS 'Tình trạng hoạt động';
          public       	   nnhao2003    false    224            �            1259    17122    notifications    TABLE     \  CREATE TABLE public.notifications (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid,
    type character varying(255),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    is_read boolean DEFAULT false,
    title character varying(255),
    content text,
    image text,
    url text,
    data jsonb
);
 !   DROP TABLE public.notifications;
       public         heap 	   nnhao2003    false    2    8    8            �            1259    16561    otps    TABLE     l  CREATE TABLE public.otps (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    type character varying(50) NOT NULL,
    issued_at timestamp without time zone DEFAULT now() NOT NULL,
    expiration_time timestamp without time zone NOT NULL,
    token character varying(255) NOT NULL,
    user_id uuid NOT NULL,
    is_used boolean DEFAULT false NOT NULL
);
    DROP TABLE public.otps;
       public         heap 	   nnhao2003    false    2    8    8            �           0    0    COLUMN otps.id    COMMENT     2   COMMENT ON COLUMN public.otps.id IS 'Mã id otp';
          public       	   nnhao2003    false    225            �           0    0    COLUMN otps.type    COMMENT     4   COMMENT ON COLUMN public.otps.type IS 'Loại OTP';
          public       	   nnhao2003    false    225            �           0    0    COLUMN otps.issued_at    COMMENT     @   COMMENT ON COLUMN public.otps.issued_at IS 'Thời gian tạo';
          public       	   nnhao2003    false    225            �           0    0    COLUMN otps.expiration_time    COMMENT     L   COMMENT ON COLUMN public.otps.expiration_time IS 'Thời gian hết hạn';
          public       	   nnhao2003    false    225            �           0    0    COLUMN otps.token    COMMENT     4   COMMENT ON COLUMN public.otps.token IS 'Token OTP';
          public       	   nnhao2003    false    225            �           0    0    COLUMN otps.user_id    COMMENT     ?   COMMENT ON COLUMN public.otps.user_id IS 'Mã người dùng';
          public       	   nnhao2003    false    225            �           0    0    COLUMN otps.is_used    COMMENT     >   COMMENT ON COLUMN public.otps.is_used IS 'Đã sử dụng?';
          public       	   nnhao2003    false    225            �            1259    16567    participants    TABLE       CREATE TABLE public.participants (
    conversation_id uuid NOT NULL,
    user_id uuid NOT NULL,
    joined_at timestamp without time zone DEFAULT now() NOT NULL,
    read_last_message_at timestamp without time zone DEFAULT now(),
    is_active boolean DEFAULT true NOT NULL
);
     DROP TABLE public.participants;
       public         heap 	   nnhao2003    false    8            �           0    0 #   COLUMN participants.conversation_id    COMMENT     U   COMMENT ON COLUMN public.participants.conversation_id IS 'Mã cuộc trò chuyện';
          public       	   nnhao2003    false    226            �           0    0    COLUMN participants.user_id    COMMENT     G   COMMENT ON COLUMN public.participants.user_id IS 'Mã người dùng';
          public       	   nnhao2003    false    226            �           0    0    COLUMN participants.joined_at    COMMENT     E   COMMENT ON COLUMN public.participants.joined_at IS 'Ngày tham gia';
          public       	   nnhao2003    false    226            �           0    0 (   COLUMN participants.read_last_message_at    COMMENT     l   COMMENT ON COLUMN public.participants.read_last_message_at IS 'Thời gian đọc tin nhắn cuối cùng';
          public       	   nnhao2003    false    226            �           0    0    COLUMN participants.is_active    COMMENT     S   COMMENT ON COLUMN public.participants.is_active IS 'Tình trạng hoạt động';
          public       	   nnhao2003    false    226            �            1259    16575    projects    TABLE     �  CREATE TABLE public.projects (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    developer_id uuid,
    project_name character varying(255) NOT NULL,
    total_area double precision,
    starting_date date,
    completion_date date,
    address jsonb,
    progression character varying(50),
    status character varying(50),
    images text[],
    verified boolean DEFAULT false,
    is_active boolean DEFAULT true,
    scale json[],
    document tsvector
);
    DROP TABLE public.projects;
       public         heap 	   nnhao2003    false    2    8    8            �           0    0    COLUMN projects.id    COMMENT     8   COMMENT ON COLUMN public.projects.id IS 'Mã dự án';
          public       	   nnhao2003    false    227            �           0    0    COLUMN projects.developer_id    COMMENT     I   COMMENT ON COLUMN public.projects.developer_id IS 'Mã nhà đầu tư';
          public       	   nnhao2003    false    227            �           0    0    COLUMN projects.project_name    COMMENT     C   COMMENT ON COLUMN public.projects.project_name IS 'Tên dự án';
          public       	   nnhao2003    false    227            �           0    0    COLUMN projects.total_area    COMMENT     G   COMMENT ON COLUMN public.projects.total_area IS 'Tổng diện tích';
          public       	   nnhao2003    false    227            �           0    0    COLUMN projects.starting_date    COMMENT     I   COMMENT ON COLUMN public.projects.starting_date IS 'Ngày bắt đầu';
          public       	   nnhao2003    false    227            �           0    0    COLUMN projects.completion_date    COMMENT     J   COMMENT ON COLUMN public.projects.completion_date IS 'Ngày kết thúc';
          public       	   nnhao2003    false    227            �           0    0    COLUMN projects.address    COMMENT     =   COMMENT ON COLUMN public.projects.address IS 'Địa chỉ';
          public       	   nnhao2003    false    227            �           0    0    COLUMN projects.progression    COMMENT     L   COMMENT ON COLUMN public.projects.progression IS 'Tiến trình thi công';
          public       	   nnhao2003    false    227            �           0    0    COLUMN projects.status    COMMENT     =   COMMENT ON COLUMN public.projects.status IS 'Tình trạng';
          public       	   nnhao2003    false    227            �           0    0    COLUMN projects.images    COMMENT     5   COMMENT ON COLUMN public.projects.images IS 'Ảnh';
          public       	   nnhao2003    false    227            �           0    0    COLUMN projects.verified    COMMENT     I   COMMENT ON COLUMN public.projects.verified IS 'Đã được xác minh';
          public       	   nnhao2003    false    227            �           0    0    COLUMN projects.is_active    COMMENT     O   COMMENT ON COLUMN public.projects.is_active IS 'Tình trạng hoạt động';
          public       	   nnhao2003    false    227            �           0    0    COLUMN projects.scale    COMMENT     6   COMMENT ON COLUMN public.projects.scale IS 'Quy mô';
          public       	   nnhao2003    false    227            �            1259    16583    property_types    TABLE     �   CREATE TABLE public.property_types (
    id character varying(50) NOT NULL,
    name character varying(255) NOT NULL,
    is_active boolean DEFAULT true NOT NULL
);
 "   DROP TABLE public.property_types;
       public         heap 	   nnhao2003    false    8            �           0    0    COLUMN property_types.id    COMMENT     P   COMMENT ON COLUMN public.property_types.id IS 'Mã loại bất động sản';
          public       	   nnhao2003    false    228            �           0    0    COLUMN property_types.name    COMMENT     8   COMMENT ON COLUMN public.property_types.name IS 'Tên';
          public       	   nnhao2003    false    228            �           0    0    COLUMN property_types.is_active    COMMENT     W   COMMENT ON COLUMN public.property_types.is_active IS 'Mã loại bất động sản';
          public       	   nnhao2003    false    228            �            1259    17255    property_types_projects    TABLE     �   CREATE TABLE public.property_types_projects (
    project_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    property_types_id character varying(50) NOT NULL
);
 +   DROP TABLE public.property_types_projects;
       public         heap 	   nnhao2003    false    2    8    8            �            1259    16590    real_estate_posts    TABLE     �  CREATE TABLE public.real_estate_posts (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    project_id uuid,
    type_id character varying(50) NOT NULL,
    status character varying NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    area double precision NOT NULL,
    address jsonb NOT NULL,
    price bigint NOT NULL,
    deposit bigint,
    is_lease boolean NOT NULL,
    posted_date timestamp without time zone DEFAULT now() NOT NULL,
    expiry_date timestamp with time zone NOT NULL,
    images text[] NOT NULL,
    videos text[],
    is_pro_seller boolean NOT NULL,
    features jsonb NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    info_message text,
    update_count integer DEFAULT 0 NOT NULL,
    display_priority_point integer DEFAULT 0 NOT NULL,
    post_approval_priority_point integer DEFAULT 0 NOT NULL,
    document tsvector
);
 %   DROP TABLE public.real_estate_posts;
       public         heap 	   nnhao2003    false    2    8    8            �           0    0    COLUMN real_estate_posts.id    COMMENT     S   COMMENT ON COLUMN public.real_estate_posts.id IS 'Mã loại bất động sản';
          public       	   nnhao2003    false    229            �           0    0     COLUMN real_estate_posts.user_id    COMMENT     L   COMMENT ON COLUMN public.real_estate_posts.user_id IS 'Mã người dùng';
          public       	   nnhao2003    false    229            �           0    0 #   COLUMN real_estate_posts.project_id    COMMENT     I   COMMENT ON COLUMN public.real_estate_posts.project_id IS 'Mã dự án';
          public       	   nnhao2003    false    229            �           0    0     COLUMN real_estate_posts.type_id    COMMENT     X   COMMENT ON COLUMN public.real_estate_posts.type_id IS 'Mã loại bất động sản';
          public       	   nnhao2003    false    229            �           0    0    COLUMN real_estate_posts.status    COMMENT     F   COMMENT ON COLUMN public.real_estate_posts.status IS 'Tình trạng';
          public       	   nnhao2003    false    229            �           0    0    COLUMN real_estate_posts.title    COMMENT     C   COMMENT ON COLUMN public.real_estate_posts.title IS 'Tiêu đề';
          public       	   nnhao2003    false    229            �           0    0 $   COLUMN real_estate_posts.description    COMMENT     R   COMMENT ON COLUMN public.real_estate_posts.description IS 'Mô tả bài đăng';
          public       	   nnhao2003    false    229            �           0    0    COLUMN real_estate_posts.area    COMMENT     C   COMMENT ON COLUMN public.real_estate_posts.area IS 'Diện tích';
          public       	   nnhao2003    false    229            �           0    0     COLUMN real_estate_posts.address    COMMENT     F   COMMENT ON COLUMN public.real_estate_posts.address IS 'Địa chỉ';
          public       	   nnhao2003    false    229            �           0    0    COLUMN real_estate_posts.price    COMMENT     C   COMMENT ON COLUMN public.real_estate_posts.price IS 'Giá tiền';
          public       	   nnhao2003    false    229            �           0    0     COLUMN real_estate_posts.deposit    COMMENT     M   COMMENT ON COLUMN public.real_estate_posts.deposit IS 'Tiền đặt cọc';
          public       	   nnhao2003    false    229            �           0    0 !   COLUMN real_estate_posts.is_lease    COMMENT     P   COMMENT ON COLUMN public.real_estate_posts.is_lease IS 'Bài đăng cho thuê';
          public       	   nnhao2003    false    229            �           0    0 $   COLUMN real_estate_posts.posted_date    COMMENT     O   COMMENT ON COLUMN public.real_estate_posts.posted_date IS 'Ngày đăng bài';
          public       	   nnhao2003    false    229            �           0    0 $   COLUMN real_estate_posts.expiry_date    COMMENT     O   COMMENT ON COLUMN public.real_estate_posts.expiry_date IS 'Ngày hết hạn';
          public       	   nnhao2003    false    229            �           0    0    COLUMN real_estate_posts.images    COMMENT     >   COMMENT ON COLUMN public.real_estate_posts.images IS 'Ảnh';
          public       	   nnhao2003    false    229            �           0    0    COLUMN real_estate_posts.videos    COMMENT     >   COMMENT ON COLUMN public.real_estate_posts.videos IS 'Video';
          public       	   nnhao2003    false    229            �           0    0 &   COLUMN real_estate_posts.is_pro_seller    COMMENT     O   COMMENT ON COLUMN public.real_estate_posts.is_pro_seller IS 'Là môi giới';
          public       	   nnhao2003    false    229            �           0    0 !   COLUMN real_estate_posts.features    COMMENT     ]   COMMENT ON COLUMN public.real_estate_posts.features IS 'Đặc điểm bất động sản';
          public       	   nnhao2003    false    229            �           0    0 "   COLUMN real_estate_posts.is_active    COMMENT     X   COMMENT ON COLUMN public.real_estate_posts.is_active IS 'Tình trạng hoạt động';
          public       	   nnhao2003    false    229            �           0    0 %   COLUMN real_estate_posts.info_message    COMMENT     a   COMMENT ON COLUMN public.real_estate_posts.info_message IS 'Thông tin từ chối (Nếu có)';
          public       	   nnhao2003    false    229            �           0    0 %   COLUMN real_estate_posts.update_count    COMMENT     V   COMMENT ON COLUMN public.real_estate_posts.update_count IS 'Số lần cập nhật';
          public       	   nnhao2003    false    229            �           0    0 /   COLUMN real_estate_posts.display_priority_point    COMMENT     g   COMMENT ON COLUMN public.real_estate_posts.display_priority_point IS 'Điểm ưu tiên hiển thị';
          public       	   nnhao2003    false    229            �           0    0 5   COLUMN real_estate_posts.post_approval_priority_point    COMMENT     m   COMMENT ON COLUMN public.real_estate_posts.post_approval_priority_point IS 'Điểm ưu tiên duyệt bài';
          public       	   nnhao2003    false    229            �            1259    16909    reports    TABLE     �  CREATE TABLE public.reports (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    reporter_id uuid NOT NULL,
    reported_id uuid NOT NULL,
    status character varying(50) NOT NULL,
    type character varying(50) NOT NULL,
    content_type character varying(50) NOT NULL,
    description text NOT NULL,
    images text[],
    created_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
    DROP TABLE public.reports;
       public         heap 	   nnhao2003    false    2    8    8            �           0    0    COLUMN reports.id    COMMENT     8   COMMENT ON COLUMN public.reports.id IS 'Mã tố cáo';
          public       	   nnhao2003    false    236            �           0    0    COLUMN reports.reporter_id    COMMENT     F   COMMENT ON COLUMN public.reports.reporter_id IS 'Mã người gửi';
          public       	   nnhao2003    false    236            �           0    0    COLUMN reports.reported_id    COMMENT     V   COMMENT ON COLUMN public.reports.reported_id IS 'Mã đối tượng bị tố cáo';
          public       	   nnhao2003    false    236            �           0    0    COLUMN reports.status    COMMENT     <   COMMENT ON COLUMN public.reports.status IS 'Tình trạng';
          public       	   nnhao2003    false    236            �           0    0    COLUMN reports.type    COMMENT     =   COMMENT ON COLUMN public.reports.type IS 'Loại tố cáo';
          public       	   nnhao2003    false    236            �           0    0    COLUMN reports.content_type    COMMENT     P   COMMENT ON COLUMN public.reports.content_type IS 'Loại nội dung tố cáo';
          public       	   nnhao2003    false    236            �           0    0    COLUMN reports.description    COMMENT     <   COMMENT ON COLUMN public.reports.description IS 'Mô tả';
          public       	   nnhao2003    false    236            �           0    0    COLUMN reports.images    COMMENT     4   COMMENT ON COLUMN public.reports.images IS 'Ảnh';
          public       	   nnhao2003    false    236            �           0    0    COLUMN reports.created_date    COMMENT     @   COMMENT ON COLUMN public.reports.created_date IS 'Ngày tạo';
          public       	   nnhao2003    false    236            �            1259    16601    sessions    TABLE       CREATE TABLE public.sessions (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    starting_date timestamp without time zone DEFAULT now() NOT NULL,
    expiration_date timestamp without time zone DEFAULT now() NOT NULL
);
    DROP TABLE public.sessions;
       public         heap 	   nnhao2003    false    2    8    8            �           0    0    COLUMN sessions.id    COMMENT     6   COMMENT ON COLUMN public.sessions.id IS 'Mã phiên';
          public       	   nnhao2003    false    230            �           0    0    COLUMN sessions.user_id    COMMENT     C   COMMENT ON COLUMN public.sessions.user_id IS 'Mã người dùng';
          public       	   nnhao2003    false    230            �           0    0    COLUMN sessions.starting_date    COMMENT     I   COMMENT ON COLUMN public.sessions.starting_date IS 'Ngày bắt đầu';
          public       	   nnhao2003    false    230            �           0    0    COLUMN sessions.expiration_date    COMMENT     J   COMMENT ON COLUMN public.sessions.expiration_date IS 'Ngày kết thúc';
          public       	   nnhao2003    false    230            �            1259    16609    subscriptions    TABLE     ]  CREATE TABLE public.subscriptions (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    package_id uuid NOT NULL,
    transaction_id uuid,
    starting_date timestamp without time zone DEFAULT now() NOT NULL,
    expiration_date timestamp without time zone NOT NULL,
    is_active boolean DEFAULT true NOT NULL
);
 !   DROP TABLE public.subscriptions;
       public         heap 	   nnhao2003    false    2    8    8            �           0    0    COLUMN subscriptions.id    COMMENT     ?   COMMENT ON COLUMN public.subscriptions.id IS 'Mã đăng ký';
          public       	   nnhao2003    false    231            �           0    0    COLUMN subscriptions.user_id    COMMENT     H   COMMENT ON COLUMN public.subscriptions.user_id IS 'Mã người dùng';
          public       	   nnhao2003    false    231            �           0    0    COLUMN subscriptions.package_id    COMMENT     M   COMMENT ON COLUMN public.subscriptions.package_id IS 'Mã gói dịch vụ';
          public       	   nnhao2003    false    231            �           0    0 #   COLUMN subscriptions.transaction_id    COMMENT     L   COMMENT ON COLUMN public.subscriptions.transaction_id IS 'Mã giao dịch';
          public       	   nnhao2003    false    231            �           0    0 "   COLUMN subscriptions.starting_date    COMMENT     N   COMMENT ON COLUMN public.subscriptions.starting_date IS 'Ngày bắt đầu';
          public       	   nnhao2003    false    231            �           0    0 $   COLUMN subscriptions.expiration_date    COMMENT     O   COMMENT ON COLUMN public.subscriptions.expiration_date IS 'Ngày kết thúc';
          public       	   nnhao2003    false    231            �           0    0    COLUMN subscriptions.is_active    COMMENT     T   COMMENT ON COLUMN public.subscriptions.is_active IS 'Tình trạng hoạt động';
          public       	   nnhao2003    false    231            �            1259    16615    transactions    TABLE     �  CREATE TABLE public.transactions (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    discount_id uuid,
    package_id uuid NOT NULL,
    num_of_subscription_month integer NOT NULL,
    app_trans_id text,
    status character varying(50) NOT NULL,
    "timestamp" timestamp without time zone DEFAULT now() NOT NULL,
    amount bigint NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    platform character varying(50)
);
     DROP TABLE public.transactions;
       public         heap 	   nnhao2003    false    2    8    8            �           0    0    COLUMN transactions.id    COMMENT     ?   COMMENT ON COLUMN public.transactions.id IS 'Mã giao dịch';
          public       	   nnhao2003    false    232            �           0    0    COLUMN transactions.user_id    COMMENT     G   COMMENT ON COLUMN public.transactions.user_id IS 'Mã người dùng';
          public       	   nnhao2003    false    232            �           0    0    COLUMN transactions.discount_id    COMMENT     H   COMMENT ON COLUMN public.transactions.discount_id IS 'Mã giảm giá';
          public       	   nnhao2003    false    232            �           0    0    COLUMN transactions.package_id    COMMENT     L   COMMENT ON COLUMN public.transactions.package_id IS 'Mã gói dịch vụ';
          public       	   nnhao2003    false    232            �           0    0 -   COLUMN transactions.num_of_subscription_month    COMMENT     ]   COMMENT ON COLUMN public.transactions.num_of_subscription_month IS 'Số tháng đăng ký';
          public       	   nnhao2003    false    232            �           0    0     COLUMN transactions.app_trans_id    COMMENT     V   COMMENT ON COLUMN public.transactions.app_trans_id IS 'Mã giao dịch bên thứ 3';
          public       	   nnhao2003    false    232            �           0    0    COLUMN transactions.status    COMMENT     M   COMMENT ON COLUMN public.transactions.status IS 'Tình trạng giao dịch';
          public       	   nnhao2003    false    232            �           0    0    COLUMN transactions."timestamp"    COMMENT     P   COMMENT ON COLUMN public.transactions."timestamp" IS 'Thời gian giao dịch';
          public       	   nnhao2003    false    232            �           0    0    COLUMN transactions.amount    COMMENT     ?   COMMENT ON COLUMN public.transactions.amount IS 'Số tiền';
          public       	   nnhao2003    false    232            �           0    0    COLUMN transactions.is_active    COMMENT     S   COMMENT ON COLUMN public.transactions.is_active IS 'Tình trạng hoạt động';
          public       	   nnhao2003    false    232            �           0    0    COLUMN transactions.platform    COMMENT     N   COMMENT ON COLUMN public.transactions.platform IS 'Thiết bị giao dịch';
          public       	   nnhao2003    false    232            �            1259    16989    user_follows    TABLE     �   CREATE TABLE public.user_follows (
    user_id uuid NOT NULL,
    follow_id uuid NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);
     DROP TABLE public.user_follows;
       public         heap 	   nnhao2003    false    8            �            1259    16639    user_post_favorites    TABLE     �   CREATE TABLE public.user_post_favorites (
    user_id uuid NOT NULL,
    real_estate_posts_id uuid NOT NULL,
    like_timestamp timestamp without time zone DEFAULT now() NOT NULL
);
 '   DROP TABLE public.user_post_favorites;
       public         heap 	   nnhao2003    false    8            �           0    0 "   COLUMN user_post_favorites.user_id    COMMENT     N   COMMENT ON COLUMN public.user_post_favorites.user_id IS 'Mã người dùng';
          public       	   nnhao2003    false    233            �           0    0 /   COLUMN user_post_favorites.real_estate_posts_id    COMMENT     X   COMMENT ON COLUMN public.user_post_favorites.real_estate_posts_id IS 'Mã bài viết';
          public       	   nnhao2003    false    233            �           0    0 )   COLUMN user_post_favorites.like_timestamp    COMMENT     U   COMMENT ON COLUMN public.user_post_favorites.like_timestamp IS 'Thời gian thích';
          public       	   nnhao2003    false    233            �            1259    16643    user_post_views    TABLE     �   CREATE TABLE public.user_post_views (
    real_estate_posts_id uuid NOT NULL,
    user_id uuid NOT NULL,
    view_date date DEFAULT now() NOT NULL
);
 #   DROP TABLE public.user_post_views;
       public         heap 	   nnhao2003    false    8            �           0    0 +   COLUMN user_post_views.real_estate_posts_id    COMMENT     T   COMMENT ON COLUMN public.user_post_views.real_estate_posts_id IS 'Mã bài viết';
          public       	   nnhao2003    false    234            �           0    0    COLUMN user_post_views.user_id    COMMENT     J   COMMENT ON COLUMN public.user_post_views.user_id IS 'Mã người dùng';
          public       	   nnhao2003    false    234                        0    0     COLUMN user_post_views.view_date    COMMENT     C   COMMENT ON COLUMN public.user_post_views.view_date IS 'Ngày xem';
          public       	   nnhao2003    false    234            �            1259    16647    users    TABLE     �  CREATE TABLE public.users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    status character varying(50) DEFAULT 'unverified'::character varying NOT NULL,
    is_identity_verified boolean DEFAULT false NOT NULL,
    role character varying DEFAULT 'user'::character varying NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    address jsonb,
    first_name character varying(50) DEFAULT 'unknow'::character varying NOT NULL,
    last_name character varying(50) DEFAULT 'unknow'::character varying NOT NULL,
    gender boolean DEFAULT false NOT NULL,
    avatar text,
    dob date DEFAULT '1969-12-31'::date NOT NULL,
    phone character varying DEFAULT 'unknow'::character varying NOT NULL,
    ban_reason text,
    is_active boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone,
    banned_util timestamp with time zone
);
    DROP TABLE public.users;
       public         heap 	   nnhao2003    false    2    8    8                       0    0    TABLE users    COMMENT     G   COMMENT ON TABLE public.users IS 'Table for storing user information';
          public       	   nnhao2003    false    235                       0    0    COLUMN users.id    COMMENT     ;   COMMENT ON COLUMN public.users.id IS 'Mã người dùng';
          public       	   nnhao2003    false    235                       0    0    COLUMN users.status    COMMENT     :   COMMENT ON COLUMN public.users.status IS 'Tình trạng';
          public       	   nnhao2003    false    235                       0    0 !   COLUMN users.is_identity_verified    COMMENT     T   COMMENT ON COLUMN public.users.is_identity_verified IS 'Đã xác minh danh tính';
          public       	   nnhao2003    false    235                       0    0    COLUMN users.role    COMMENT     3   COMMENT ON COLUMN public.users.role IS 'Vai trò';
          public       	   nnhao2003    false    235                       0    0    COLUMN users.email    COMMENT     1   COMMENT ON COLUMN public.users.email IS 'Email';
          public       	   nnhao2003    false    235                       0    0    COLUMN users.password    COMMENT     ;   COMMENT ON COLUMN public.users.password IS 'Mật khẩu';
          public       	   nnhao2003    false    235                       0    0    COLUMN users.address    COMMENT     :   COMMENT ON COLUMN public.users.address IS 'Địa chỉ';
          public       	   nnhao2003    false    235            	           0    0    COLUMN users.first_name    COMMENT     5   COMMENT ON COLUMN public.users.first_name IS 'Tên';
          public       	   nnhao2003    false    235            
           0    0    COLUMN users.last_name    COMMENT     4   COMMENT ON COLUMN public.users.last_name IS 'Họ';
          public       	   nnhao2003    false    235                       0    0    COLUMN users.gender    COMMENT     8   COMMENT ON COLUMN public.users.gender IS 'Gới tính';
          public       	   nnhao2003    false    235                       0    0    COLUMN users.avatar    COMMENT     @   COMMENT ON COLUMN public.users.avatar IS 'Ảnh đại diện';
          public       	   nnhao2003    false    235                       0    0    COLUMN users.dob    COMMENT     4   COMMENT ON COLUMN public.users.dob IS 'Ngày sinh';
          public       	   nnhao2003    false    235                       0    0    COLUMN users.phone    COMMENT     @   COMMENT ON COLUMN public.users.phone IS 'Số điện thoại';
          public       	   nnhao2003    false    235                       0    0    COLUMN users.ban_reason    COMMENT     ;   COMMENT ON COLUMN public.users.ban_reason IS 'Lý do ban';
          public       	   nnhao2003    false    235                       0    0    COLUMN users.is_active    COMMENT     L   COMMENT ON COLUMN public.users.is_active IS 'Tình trạng hoạt động';
          public       	   nnhao2003    false    235                       0    0    COLUMN users.created_at    COMMENT     <   COMMENT ON COLUMN public.users.created_at IS 'Ngày tạo';
          public       	   nnhao2003    false    235                       0    0    COLUMN users.updated_at    COMMENT     C   COMMENT ON COLUMN public.users.updated_at IS 'Ngày cập nhật';
          public       	   nnhao2003    false    235                       0    0    COLUMN users.banned_util    COMMENT     I   COMMENT ON COLUMN public.users.banned_util IS 'Bị khoá đến ngày';
          public       	   nnhao2003    false    235            N          0    17108    account_verification_requests 
   TABLE DATA             COPY public.account_verification_requests (id, is_verified, reviewed_at, rejected_info, user_id, request_date, front_identity_card_image_link, back_identity_card_image_link, portrait_image_link, full_name, sex, dob, identity_card_no, identity_card_issued_date, issued_by) FROM stdin;
    public       	   nnhao2003    false    238   <q      ;          0    16506    blogs 
   TABLE DATA           p   COPY public.blogs (id, title, short_description, author, thumbnail, content, is_active, created_at) FROM stdin;
    public       	   nnhao2003    false    219   Ry      <          0    16522    conversations 
   TABLE DATA           T   COPY public.conversations (id, created_at, last_messsage_id, is_active) FROM stdin;
    public       	   nnhao2003    false    220   4�      =          0    16528 
   developers 
   TABLE DATA           Z   COPY public.developers (id, description, images, created_at, is_active, name) FROM stdin;
    public       	   nnhao2003    false    221   ��      >          0    16536    discount_codes 
   TABLE DATA           �   COPY public.discount_codes (id, package_id, discount_percent, starting_date, expiration_date, description, created_at, is_active, limited_quantity, code, min_subscription_months) FROM stdin;
    public       	   nnhao2003    false    222   %�      ?          0    16544    membership_packages 
   TABLE DATA           �   COPY public.membership_packages (id, name, description, price_per_month, monthly_post_limit, is_active, created_at, display_priority_point, post_approval_priority_point) FROM stdin;
    public       	   nnhao2003    false    223   ��      @          0    16553    messages 
   TABLE DATA           m   COPY public.messages (id, conversation_id, sender_id, content_type, content, sent_at, is_active) FROM stdin;
    public       	   nnhao2003    false    224   ��      O          0    17122    notifications 
   TABLE DATA           q   COPY public.notifications (id, user_id, type, created_at, is_read, title, content, image, url, data) FROM stdin;
    public       	   nnhao2003    false    239   ��      A          0    16561    otps 
   TABLE DATA           ]   COPY public.otps (id, type, issued_at, expiration_time, token, user_id, is_used) FROM stdin;
    public       	   nnhao2003    false    225   �      B          0    16567    participants 
   TABLE DATA           l   COPY public.participants (conversation_id, user_id, joined_at, read_last_message_at, is_active) FROM stdin;
    public       	   nnhao2003    false    226   �      C          0    16575    projects 
   TABLE DATA           �   COPY public.projects (id, developer_id, project_name, total_area, starting_date, completion_date, address, progression, status, images, verified, is_active, scale, document) FROM stdin;
    public       	   nnhao2003    false    227   \      D          0    16583    property_types 
   TABLE DATA           =   COPY public.property_types (id, name, is_active) FROM stdin;
    public       	   nnhao2003    false    228   �      P          0    17255    property_types_projects 
   TABLE DATA           P   COPY public.property_types_projects (project_id, property_types_id) FROM stdin;
    public       	   nnhao2003    false    240   @      E          0    16590    real_estate_posts 
   TABLE DATA           <  COPY public.real_estate_posts (id, user_id, project_id, type_id, status, title, description, area, address, price, deposit, is_lease, posted_date, expiry_date, images, videos, is_pro_seller, features, is_active, info_message, update_count, display_priority_point, post_approval_priority_point, document) FROM stdin;
    public       	   nnhao2003    false    229   �      L          0    16909    reports 
   TABLE DATA           ~   COPY public.reports (id, reporter_id, reported_id, status, type, content_type, description, images, created_date) FROM stdin;
    public       	   nnhao2003    false    236   �      F          0    16601    sessions 
   TABLE DATA           O   COPY public.sessions (id, user_id, starting_date, expiration_date) FROM stdin;
    public       	   nnhao2003    false    230   y�      G          0    16609    subscriptions 
   TABLE DATA           {   COPY public.subscriptions (id, user_id, package_id, transaction_id, starting_date, expiration_date, is_active) FROM stdin;
    public       	   nnhao2003    false    231   ��      H          0    16615    transactions 
   TABLE DATA           �   COPY public.transactions (id, user_id, discount_id, package_id, num_of_subscription_month, app_trans_id, status, "timestamp", amount, is_active, platform) FROM stdin;
    public       	   nnhao2003    false    232   ��      M          0    16989    user_follows 
   TABLE DATA           F   COPY public.user_follows (user_id, follow_id, created_at) FROM stdin;
    public       	   nnhao2003    false    237   �      I          0    16639    user_post_favorites 
   TABLE DATA           \   COPY public.user_post_favorites (user_id, real_estate_posts_id, like_timestamp) FROM stdin;
    public       	   nnhao2003    false    233   T      J          0    16643    user_post_views 
   TABLE DATA           S   COPY public.user_post_views (real_estate_posts_id, user_id, view_date) FROM stdin;
    public       	   nnhao2003    false    234   )      K          0    16647    users 
   TABLE DATA           �   COPY public.users (id, status, is_identity_verified, role, email, password, address, first_name, last_name, gender, avatar, dob, phone, ban_reason, is_active, created_at, updated_at, banned_util) FROM stdin;
    public       	   nnhao2003    false    235   F      �           2606    17116 @   account_verification_requests account_verification_requests_pkey 
   CONSTRAINT     ~   ALTER TABLE ONLY public.account_verification_requests
    ADD CONSTRAINT account_verification_requests_pkey PRIMARY KEY (id);
 j   ALTER TABLE ONLY public.account_verification_requests DROP CONSTRAINT account_verification_requests_pkey;
       public         	   nnhao2003    false    238            a           2606    16665    blogs blogs_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.blogs
    ADD CONSTRAINT blogs_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.blogs DROP CONSTRAINT blogs_pkey;
       public         	   nnhao2003    false    219            g           2606    16891    discount_codes code_unique 
   CONSTRAINT     U   ALTER TABLE ONLY public.discount_codes
    ADD CONSTRAINT code_unique UNIQUE (code);
 D   ALTER TABLE ONLY public.discount_codes DROP CONSTRAINT code_unique;
       public         	   nnhao2003    false    222            c           2606    16669     conversations conversations_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY public.conversations
    ADD CONSTRAINT conversations_pkey PRIMARY KEY (id);
 J   ALTER TABLE ONLY public.conversations DROP CONSTRAINT conversations_pkey;
       public         	   nnhao2003    false    220            e           2606    16671    developers developers_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.developers
    ADD CONSTRAINT developers_pkey PRIMARY KEY (id);
 D   ALTER TABLE ONLY public.developers DROP CONSTRAINT developers_pkey;
       public         	   nnhao2003    false    221            i           2606    16673 "   discount_codes discount_codes_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY public.discount_codes
    ADD CONSTRAINT discount_codes_pkey PRIMARY KEY (id);
 L   ALTER TABLE ONLY public.discount_codes DROP CONSTRAINT discount_codes_pkey;
       public         	   nnhao2003    false    222            k           2606    16675 ,   membership_packages membership_packages_pkey 
   CONSTRAINT     j   ALTER TABLE ONLY public.membership_packages
    ADD CONSTRAINT membership_packages_pkey PRIMARY KEY (id);
 V   ALTER TABLE ONLY public.membership_packages DROP CONSTRAINT membership_packages_pkey;
       public         	   nnhao2003    false    223            m           2606    16677    messages messages_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.messages DROP CONSTRAINT messages_pkey;
       public         	   nnhao2003    false    224            �           2606    17131     notifications notifications_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);
 J   ALTER TABLE ONLY public.notifications DROP CONSTRAINT notifications_pkey;
       public         	   nnhao2003    false    239            o           2606    16679    otps otps_pkey 
   CONSTRAINT     L   ALTER TABLE ONLY public.otps
    ADD CONSTRAINT otps_pkey PRIMARY KEY (id);
 8   ALTER TABLE ONLY public.otps DROP CONSTRAINT otps_pkey;
       public         	   nnhao2003    false    225            q           2606    16681    participants participants_pkey 
   CONSTRAINT     r   ALTER TABLE ONLY public.participants
    ADD CONSTRAINT participants_pkey PRIMARY KEY (conversation_id, user_id);
 H   ALTER TABLE ONLY public.participants DROP CONSTRAINT participants_pkey;
       public         	   nnhao2003    false    226    226            t           2606    16685    projects projects_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.projects DROP CONSTRAINT projects_pkey;
       public         	   nnhao2003    false    227            v           2606    16687 "   property_types property_types_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY public.property_types
    ADD CONSTRAINT property_types_pkey PRIMARY KEY (id);
 L   ALTER TABLE ONLY public.property_types DROP CONSTRAINT property_types_pkey;
       public         	   nnhao2003    false    228            �           2606    17260 4   property_types_projects property_types_projects_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public.property_types_projects
    ADD CONSTRAINT property_types_projects_pkey PRIMARY KEY (project_id, property_types_id);
 ^   ALTER TABLE ONLY public.property_types_projects DROP CONSTRAINT property_types_projects_pkey;
       public         	   nnhao2003    false    240    240            y           2606    16689 (   real_estate_posts real_estate_posts_pkey 
   CONSTRAINT     f   ALTER TABLE ONLY public.real_estate_posts
    ADD CONSTRAINT real_estate_posts_pkey PRIMARY KEY (id);
 R   ALTER TABLE ONLY public.real_estate_posts DROP CONSTRAINT real_estate_posts_pkey;
       public         	   nnhao2003    false    229            �           2606    16917    reports reports_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.reports
    ADD CONSTRAINT reports_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.reports DROP CONSTRAINT reports_pkey;
       public         	   nnhao2003    false    236            {           2606    16691    sessions sessions_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.sessions DROP CONSTRAINT sessions_pkey;
       public         	   nnhao2003    false    230            }           2606    16693    subscriptions subscription_pkey 
   CONSTRAINT     ]   ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscription_pkey PRIMARY KEY (id);
 I   ALTER TABLE ONLY public.subscriptions DROP CONSTRAINT subscription_pkey;
       public         	   nnhao2003    false    231                       2606    16695    transactions transactions_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_pkey PRIMARY KEY (id);
 H   ALTER TABLE ONLY public.transactions DROP CONSTRAINT transactions_pkey;
       public         	   nnhao2003    false    232            �           2606    16994    user_follows user_follows_pkey 
   CONSTRAINT     l   ALTER TABLE ONLY public.user_follows
    ADD CONSTRAINT user_follows_pkey PRIMARY KEY (user_id, follow_id);
 H   ALTER TABLE ONLY public.user_follows DROP CONSTRAINT user_follows_pkey;
       public         	   nnhao2003    false    237    237            �           2606    16705 +   user_post_favorites user_post_favorite_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public.user_post_favorites
    ADD CONSTRAINT user_post_favorite_pkey PRIMARY KEY (real_estate_posts_id, user_id);
 U   ALTER TABLE ONLY public.user_post_favorites DROP CONSTRAINT user_post_favorite_pkey;
       public         	   nnhao2003    false    233    233            �           2606    16707 $   user_post_views user_post_views_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public.user_post_views
    ADD CONSTRAINT user_post_views_pkey PRIMARY KEY (real_estate_posts_id, user_id, view_date);
 N   ALTER TABLE ONLY public.user_post_views DROP CONSTRAINT user_post_views_pkey;
       public         	   nnhao2003    false    234    234    234            �           2606    16709    users users_email_key 
   CONSTRAINT     Q   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);
 ?   ALTER TABLE ONLY public.users DROP CONSTRAINT users_email_key;
       public         	   nnhao2003    false    235            �           2606    16711    users users_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public         	   nnhao2003    false    235                       0    0    INDEX conversations_pkey    COMMENT     _   COMMENT ON INDEX public.conversations_pkey IS 'Primary key index for the conversations table';
          public       	   nnhao2003    false    3171                       0    0    INDEX developers_pkey    COMMENT     Y   COMMENT ON INDEX public.developers_pkey IS 'Primary key index for the developers table';
          public       	   nnhao2003    false    3173                       0    0    INDEX discount_codes_pkey    COMMENT     a   COMMENT ON INDEX public.discount_codes_pkey IS 'Primary key index for the discount_codes table';
          public       	   nnhao2003    false    3177            w           1259    16882    document_idx    INDEX     L   CREATE INDEX document_idx ON public.real_estate_posts USING gin (document);
     DROP INDEX public.document_idx;
       public         	   nnhao2003    false    229                       0    0    INDEX membership_packages_pkey    COMMENT     k   COMMENT ON INDEX public.membership_packages_pkey IS 'Primary key index for the membership_packages table';
          public       	   nnhao2003    false    3179                       0    0    INDEX messages_pkey    COMMENT     U   COMMENT ON INDEX public.messages_pkey IS 'Primary key index for the messages table';
          public       	   nnhao2003    false    3181                       0    0    INDEX otps_pkey    COMMENT     M   COMMENT ON INDEX public.otps_pkey IS 'Primary key index for the otps table';
          public       	   nnhao2003    false    3183                       0    0    INDEX participants_pkey    COMMENT     ]   COMMENT ON INDEX public.participants_pkey IS 'Primary key index for the participants table';
          public       	   nnhao2003    false    3185            r           1259    17266    project_document_idx    INDEX     K   CREATE INDEX project_document_idx ON public.projects USING gin (document);
 (   DROP INDEX public.project_document_idx;
       public         	   nnhao2003    false    227                       0    0    INDEX projects_pkey    COMMENT     U   COMMENT ON INDEX public.projects_pkey IS 'Primary key index for the projects table';
          public       	   nnhao2003    false    3188                       0    0    INDEX property_types_pkey    COMMENT     a   COMMENT ON INDEX public.property_types_pkey IS 'Primary key index for the property_types table';
          public       	   nnhao2003    false    3190                       0    0    INDEX real_estate_posts_pkey    COMMENT     g   COMMENT ON INDEX public.real_estate_posts_pkey IS 'Primary key index for the real_estate_posts table';
          public       	   nnhao2003    false    3193                       0    0    INDEX users_pkey    COMMENT     O   COMMENT ON INDEX public.users_pkey IS 'Primary key index for the users table';
          public       	   nnhao2003    false    3207            �           2620    16945    messages trigger_data_insert    TRIGGER     ~   CREATE TRIGGER trigger_data_insert AFTER INSERT ON public.messages FOR EACH ROW EXECUTE FUNCTION public.notify_data_insert();
 5   DROP TRIGGER trigger_data_insert ON public.messages;
       public       	   nnhao2003    false    264    224            �           2620    17268    projects tsvectorupdate    TRIGGER     �   CREATE TRIGGER tsvectorupdate BEFORE INSERT OR UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.projects_trigger();
 0   DROP TRIGGER tsvectorupdate ON public.projects;
       public       	   nnhao2003    false    227    269            �           2620    16884     real_estate_posts tsvectorupdate    TRIGGER     �   CREATE TRIGGER tsvectorupdate BEFORE INSERT OR UPDATE ON public.real_estate_posts FOR EACH ROW EXECUTE FUNCTION public.real_estate_posts_trigger();
 9   DROP TRIGGER tsvectorupdate ON public.real_estate_posts;
       public       	   nnhao2003    false    229    262            �           2606    16712 #   otps FK_3938bb24b38ad395af30230bded    FK CONSTRAINT     �   ALTER TABLE ONLY public.otps
    ADD CONSTRAINT "FK_3938bb24b38ad395af30230bded" FOREIGN KEY (user_id) REFERENCES public.users(id);
 O   ALTER TABLE ONLY public.otps DROP CONSTRAINT "FK_3938bb24b38ad395af30230bded";
       public       	   nnhao2003    false    225    235    3207                       0    0 3   CONSTRAINT "FK_3938bb24b38ad395af30230bded" ON otps    COMMENT     n   COMMENT ON CONSTRAINT "FK_3938bb24b38ad395af30230bded" ON public.otps IS 'FK constraint for user_id in otps';
          public       	   nnhao2003    false    3220            �           2606    16722    sessions FK_SESSION_USER    FK CONSTRAINT     y   ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT "FK_SESSION_USER" FOREIGN KEY (user_id) REFERENCES public.users(id);
 D   ALTER TABLE ONLY public.sessions DROP CONSTRAINT "FK_SESSION_USER";
       public       	   nnhao2003    false    3207    230    235                        0    0 (   CONSTRAINT "FK_SESSION_USER" ON sessions    COMMENT     g   COMMENT ON CONSTRAINT "FK_SESSION_USER" ON public.sessions IS 'FK constraint for user_id in sessions';
          public       	   nnhao2003    false    3225            �           2606    17117 H   account_verification_requests account_verification_requests_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.account_verification_requests
    ADD CONSTRAINT account_verification_requests_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);
 r   ALTER TABLE ONLY public.account_verification_requests DROP CONSTRAINT account_verification_requests_user_id_fkey;
       public       	   nnhao2003    false    238    235    3207            �           2606    16742 -   discount_codes discount_codes_package_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.discount_codes
    ADD CONSTRAINT discount_codes_package_id_fkey FOREIGN KEY (package_id) REFERENCES public.membership_packages(id) NOT VALID;
 W   ALTER TABLE ONLY public.discount_codes DROP CONSTRAINT discount_codes_package_id_fkey;
       public       	   nnhao2003    false    222    3179    223            !           0    0 ;   CONSTRAINT discount_codes_package_id_fkey ON discount_codes    COMMENT     �   COMMENT ON CONSTRAINT discount_codes_package_id_fkey ON public.discount_codes IS 'FK constraint for package_id in discount_codes';
          public       	   nnhao2003    false    3218            �           2606    16923    real_estate_posts fk_post_type    FK CONSTRAINT     �   ALTER TABLE ONLY public.real_estate_posts
    ADD CONSTRAINT fk_post_type FOREIGN KEY (type_id) REFERENCES public.property_types(id);
 H   ALTER TABLE ONLY public.real_estate_posts DROP CONSTRAINT fk_post_type;
       public       	   nnhao2003    false    229    228    3190            �           2606    17261 %   property_types_projects fk_project_id    FK CONSTRAINT     �   ALTER TABLE ONLY public.property_types_projects
    ADD CONSTRAINT fk_project_id FOREIGN KEY (project_id) REFERENCES public.projects(id);
 O   ALTER TABLE ONLY public.property_types_projects DROP CONSTRAINT fk_project_id;
       public       	   nnhao2003    false    3188    240    227            �           2606    16747 &   messages messages_conversation_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_conversation_id_fkey FOREIGN KEY (conversation_id, sender_id) REFERENCES public.participants(conversation_id, user_id) NOT VALID;
 P   ALTER TABLE ONLY public.messages DROP CONSTRAINT messages_conversation_id_fkey;
       public       	   nnhao2003    false    224    224    3185    226    226            "           0    0 4   CONSTRAINT messages_conversation_id_fkey ON messages    COMMENT     �   COMMENT ON CONSTRAINT messages_conversation_id_fkey ON public.messages IS 'FK constraint for conversation_id and sender_id in messages';
          public       	   nnhao2003    false    3219            �           2606    17132 (   notifications notifications_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);
 R   ALTER TABLE ONLY public.notifications DROP CONSTRAINT notifications_user_id_fkey;
       public       	   nnhao2003    false    3207    239    235            �           2606    16752 .   participants participants_conversation_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.participants
    ADD CONSTRAINT participants_conversation_id_fkey FOREIGN KEY (conversation_id) REFERENCES public.conversations(id) NOT VALID;
 X   ALTER TABLE ONLY public.participants DROP CONSTRAINT participants_conversation_id_fkey;
       public       	   nnhao2003    false    226    220    3171            #           0    0 <   CONSTRAINT participants_conversation_id_fkey ON participants    COMMENT     �   COMMENT ON CONSTRAINT participants_conversation_id_fkey ON public.participants IS 'FK constraint for conversation_id in participants';
          public       	   nnhao2003    false    3221            �           2606    16757 &   participants participants_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.participants
    ADD CONSTRAINT participants_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) NOT VALID;
 P   ALTER TABLE ONLY public.participants DROP CONSTRAINT participants_user_id_fkey;
       public       	   nnhao2003    false    3207    235    226            $           0    0 4   CONSTRAINT participants_user_id_fkey ON participants    COMMENT     w   COMMENT ON CONSTRAINT participants_user_id_fkey ON public.participants IS 'FK constraint for user_id in participants';
          public       	   nnhao2003    false    3222            �           2606    16772 #   projects projects_developer_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_developer_id_fkey FOREIGN KEY (developer_id) REFERENCES public.developers(id) NOT VALID;
 M   ALTER TABLE ONLY public.projects DROP CONSTRAINT projects_developer_id_fkey;
       public       	   nnhao2003    false    221    227    3173            %           0    0 1   CONSTRAINT projects_developer_id_fkey ON projects    COMMENT     u   COMMENT ON CONSTRAINT projects_developer_id_fkey ON public.projects IS 'FK constraint for developer_id in projects';
          public       	   nnhao2003    false    3223            �           2606    16918    reports reports_user_id_fkey    FK CONSTRAINT        ALTER TABLE ONLY public.reports
    ADD CONSTRAINT reports_user_id_fkey FOREIGN KEY (reporter_id) REFERENCES public.users(id);
 F   ALTER TABLE ONLY public.reports DROP CONSTRAINT reports_user_id_fkey;
       public       	   nnhao2003    false    235    3207    236            �           2606    16792 *   subscriptions subscription_package_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscription_package_id_fkey FOREIGN KEY (package_id) REFERENCES public.membership_packages(id) NOT VALID;
 T   ALTER TABLE ONLY public.subscriptions DROP CONSTRAINT subscription_package_id_fkey;
       public       	   nnhao2003    false    231    223    3179            &           0    0 8   CONSTRAINT subscription_package_id_fkey ON subscriptions    COMMENT        COMMENT ON CONSTRAINT subscription_package_id_fkey ON public.subscriptions IS 'FK constraint for package_id in subscriptions';
          public       	   nnhao2003    false    3226            �           2606    16797 .   subscriptions subscription_transaction_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscription_transaction_id_fkey FOREIGN KEY (transaction_id) REFERENCES public.transactions(id) NOT VALID;
 X   ALTER TABLE ONLY public.subscriptions DROP CONSTRAINT subscription_transaction_id_fkey;
       public       	   nnhao2003    false    232    231    3199            '           0    0 <   CONSTRAINT subscription_transaction_id_fkey ON subscriptions    COMMENT     �   COMMENT ON CONSTRAINT subscription_transaction_id_fkey ON public.subscriptions IS 'FK constraint for transaction_id in subscriptions';
          public       	   nnhao2003    false    3227            �           2606    16802 '   subscriptions subscription_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscription_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) NOT VALID;
 Q   ALTER TABLE ONLY public.subscriptions DROP CONSTRAINT subscription_user_id_fkey;
       public       	   nnhao2003    false    231    3207    235            (           0    0 5   CONSTRAINT subscription_user_id_fkey ON subscriptions    COMMENT     y   COMMENT ON CONSTRAINT subscription_user_id_fkey ON public.subscriptions IS 'FK constraint for user_id in subscriptions';
          public       	   nnhao2003    false    3228            �           2606    16885 *   transactions transactions_discount_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_discount_id_fkey FOREIGN KEY (discount_id) REFERENCES public.discount_codes(id) NOT VALID;
 T   ALTER TABLE ONLY public.transactions DROP CONSTRAINT transactions_discount_id_fkey;
       public       	   nnhao2003    false    3177    232    222            )           0    0 8   CONSTRAINT transactions_discount_id_fkey ON transactions    COMMENT        COMMENT ON CONSTRAINT transactions_discount_id_fkey ON public.transactions IS 'FK constraint for discount_id in transactions';
          public       	   nnhao2003    false    3229            �           2606    16812 )   transactions transactions_package_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_package_id_fkey FOREIGN KEY (package_id) REFERENCES public.membership_packages(id) NOT VALID;
 S   ALTER TABLE ONLY public.transactions DROP CONSTRAINT transactions_package_id_fkey;
       public       	   nnhao2003    false    223    232    3179            *           0    0 7   CONSTRAINT transactions_package_id_fkey ON transactions    COMMENT     }   COMMENT ON CONSTRAINT transactions_package_id_fkey ON public.transactions IS 'FK constraint for package_id in transactions';
          public       	   nnhao2003    false    3230            �           2606    16817 &   transactions transactions_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) NOT VALID;
 P   ALTER TABLE ONLY public.transactions DROP CONSTRAINT transactions_user_id_fkey;
       public       	   nnhao2003    false    232    3207    235            �           2606    17000 (   user_follows user_follows_follow_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.user_follows
    ADD CONSTRAINT user_follows_follow_id_fkey FOREIGN KEY (follow_id) REFERENCES public.users(id) ON DELETE CASCADE;
 R   ALTER TABLE ONLY public.user_follows DROP CONSTRAINT user_follows_follow_id_fkey;
       public       	   nnhao2003    false    3207    237    235            �           2606    16995 &   user_follows user_follows_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.user_follows
    ADD CONSTRAINT user_follows_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
 P   ALTER TABLE ONLY public.user_follows DROP CONSTRAINT user_follows_user_id_fkey;
       public       	   nnhao2003    false    237    235    3207            �           2606    16852 @   user_post_favorites user_post_favorite_real_estate_posts_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.user_post_favorites
    ADD CONSTRAINT user_post_favorite_real_estate_posts_id_fkey FOREIGN KEY (real_estate_posts_id) REFERENCES public.real_estate_posts(id) NOT VALID;
 j   ALTER TABLE ONLY public.user_post_favorites DROP CONSTRAINT user_post_favorite_real_estate_posts_id_fkey;
       public       	   nnhao2003    false    3193    233    229            �           2606    16857 4   user_post_favorites user_post_favorite_users_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.user_post_favorites
    ADD CONSTRAINT user_post_favorite_users_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) NOT VALID;
 ^   ALTER TABLE ONLY public.user_post_favorites DROP CONSTRAINT user_post_favorite_users_id_fkey;
       public       	   nnhao2003    false    235    233    3207            �           2606    16862 9   user_post_views user_post_views_real_estate_posts_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.user_post_views
    ADD CONSTRAINT user_post_views_real_estate_posts_id_fkey FOREIGN KEY (real_estate_posts_id) REFERENCES public.real_estate_posts(id);
 c   ALTER TABLE ONLY public.user_post_views DROP CONSTRAINT user_post_views_real_estate_posts_id_fkey;
       public       	   nnhao2003    false    229    234    3193            �           2606    16867 -   user_post_views user_post_views_users_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.user_post_views
    ADD CONSTRAINT user_post_views_users_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);
 W   ALTER TABLE ONLY public.user_post_views DROP CONSTRAINT user_post_views_users_id_fkey;
       public       	   nnhao2003    false    234    235    3207            a           826    16391     DEFAULT PRIVILEGES FOR SEQUENCES    DEFAULT ACL     P   ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON SEQUENCES TO nnhao2003;
                   postgres    false            c           826    16393    DEFAULT PRIVILEGES FOR TYPES    DEFAULT ACL     L   ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON TYPES TO nnhao2003;
                   postgres    false            b           826    16392     DEFAULT PRIVILEGES FOR FUNCTIONS    DEFAULT ACL     P   ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON FUNCTIONS TO nnhao2003;
                   postgres    false            `           826    16390    DEFAULT PRIVILEGES FOR TABLES    DEFAULT ACL     M   ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON TABLES TO nnhao2003;
                   postgres    false            N     x��X�n��]S_�(�֭�� x!6c ǆW�Y����#i`��E��<��$��� ���$��l�[�4F�![�M�=�<.s�d�Xec&esT0SRBe�8%?���5Lli��%כؓ�ll~|���� ʳN���a���OL��}��Ћtbo7�ww7�������]�狫���n��<�Ӈ�����2��N�o�]�|�Ao�oO��IJ ��!+��W���|��P���L�]�m(�I����^{��Y�g���a,G]���A�bMNY1IE_��	:�1�d���t�~������>����:ˡ�l�8"i�좳�O�:k���o�>~�ۛ�������������O߷_���oڳ�~Ţ���?<����o�jx����?��;I$�h���C�Tr4*gG?�.\1R�cy�޺.Zi��ͻ�����j�t�ަܞ�_���*__���m{����������=9(�iR�L C�K�0�4�q�zҋ��"����b����nί�oO���}����5�$��ny��ɯ[nI2V7�ϻ_�;�
���m�Q�Mitؚ(�-�co�3�a��;�VKϾg�I4����޶衯�޾y����3M2M�*�@_�dT���s
��98_�Z\�s�����\U�A�������Q��͞�C�11�D<���kK�'���(ֲ��mZ���yw_�{x���潊�]�0�CC`v�B�!	���k����P'�Ż�R(�R��BY�:CM�!y�����E�es�;���Q�\��6ۘ_�l%��Lh�	���W�	Y�)�J�B�8*z���^�����$��$����:��Etv�gS��j�0zS!���J����1�Ef޿ܶ�>���hs����3R`�F��ق�@��Ǒu�Qr�y��ϫ���Ǐ��o�q�Q6*�*̒#�F�&^������u�hi��R���]��mS^k���x�S���Pe����K�+X��y�Hz;�^1�9E�����y�2O�*�'��~�ǶBA;���W��f}��S=}��F�a,�ŐG�( 5���Ʈb4v<�Q�6���R5���+�Q<n��fw[(��/�Pi�������s��a��e�kwZ��T`�W�Z��oVw.��<�n�5$���j��Eet�퓪���$�t�.ڻ��k�.��1'��<LI-����5��%��8����j�,Ʈ\.��h�Y�x��>�v1����;f�h�_�bĶ�.�fX]�+���A�F��M>�<����(�j,��i4���J�g9�`~ѽ�6 ��o
�.��ߗ��09�����q�d=QE{mf0@ȮeJI��	�S>���N.ފ�S��K��k�8�:�	K�.J8�,tE����w��!d�$�
B.�CWT(cR\$#bR���:eX�Бk6�h�SgY�I`m����6r�C8RҬw�٬�.6Da��J�#��k�,h�΂ž�)e3�l�2G��L����ZY�J�x�[z+���	�*S�>T���Pm~����!an�({Ӻ�$��$m�w߲��)dG�koMC�UF����g�WY���wt��������Q�M�Y��:�Dl`$���԰sT˱rw�^pU�*@���]�5_�Hu:�fսb'�>8gtVL�Q���S�1?`ΰ/�5�(4S��}cʱ�d�S�>�3��)�,�ˣ�X�4&�AY��J��9�z�1a���=lvr���mϞ�ل>;�9�B1�w�K����ر�'s�c�4�2�R�<L*��%��f??��ώ.���ܰ��VG��� ��6��$K��|6�	��0�0B(��QءV�Ä����N���yro*�X !�CK��\�D4�-��"�е]��C�p`r<`�2��4��x3�����\L<�H������j��l�����e(ٌ�dX���7��d�����srr��n%:�������Y{}�t���gc�gO&��g�P�yc�E��}�t޿"_�FH(א \�I�C�؝����ယ      ;      x��{�Ǒ/�7�)
����v���1��IKԊ�űVޣ#�5]��Vw�p��W80c�|�^]���$� ���$�ct����'���UY���<���j=��G>"��Ȭ'KX愡�~�;N��,JM=r�(�,/L]����>ע����͵r��я�r��/?zg~�]{���R���Ǐ~
�?|0���w�Ǐ~���߼��v���/������Ï��ޚi�a�n��{����.�錴}���6��w�Z���_����˯>�]��/.���Y-��~<��H?��������񣷵��_���/���f"���h[����{g|a��n;?�0)��joww�&9ϊ�\����K�r�������+���a��n��n���x�o�z������\ÿ��;��Wز��i���s;3���$-Y>ݹze��S�Z=�S�ǥ����̳���ڵӏ�8��@���>�tT���kX�����bS���4^��������}�:D,�0���j�`�}D��	>���ß���iK�̀�%����W0\�IQ�⌯�.�^���2��#��0����鼄��3X�e���S���Ʀ%�u�C?:�=��1��ʊ�q����jq�9���w���]����~_YZX����<2�F?�1T������=�v�F���E�A�&92-i������7G����xW���b�M��ȕ��Gk���!������i����{s��?k�<~��G�+x� ?�`s���$���q��
5��z(>�th������O?,!��9�-=a�>O� �׮#��o�4)
�p¸�sT�wT���\V�Ғ���=�@�b�,o���@�9��Q����\�i�}Q[�5с����m
�×
����u��\�� z`���c������cj���j�yQ+?���:�2J�����!N{�\P~��b,%�"�:_� �1��XjM����L���g�||�ĳ�55]3��\O�`-�����j��j���?���5~ ���c�&SiP�o@S��5^k�-)W׾G�Klq�-���;�4�-����`%b����(5�~�4ލ���}b����g��_l�@I ����$|��}$���n$5i�L�"���ۺ� xrV�6��+-"A3)��\����k�=G�/�=ژ�
@�
�Dއ�=KJ����Y�s��6�;i����v��/�����F�E�zF2;�w\����	Z���/���}l�hP'�]� ��sI~�!M�$�Tg�J7Q���/�����Db>���Z/�1�E�WO�: ����^.�I<��?�Q�c��[H�G?�5�����$�9���-l��\���T�%�w�oR��*��R8��IGrج)� F6���~M�MA�
D�[�Z��_Rś�:\�ُъ>K
�!�[j�p�yQa$��qZ�&+�"��z�R�۫�0�,��	h-�ea&�XS=�ZuP���f�L���%j�p��V@C;���I�Y�����R	c�~@S��s�$��=0�7o�)˨ɟg��>���6�8��GJ�G4o��C�<ܽ�Y&��T��04\1$X��sN���쉊
�%LL���AN�p<��
'�����e=�d�ڞ>A]5��`,1[�y1�z%�]mf�p؋�f{a��͒����V�����~��y�$
��ֈ�
�l��P��LA����^[�Ģ]g�NC��T7�S�$+���F{��q�G)����Q5��:}o-W��g?���m��N��9�H�k@qq�����K��@l1�u�m�B��b����/0�� *��f�;q/J��
	�u��_��"��(&ak��J%K��T\r�z� ��n�/��Pd� �j-i���?)U_s��63�
y�B�K�+���S���X�^��3F?V���3�A�k1)���z� D1�U���7�y@|��\a�z1٠f��ƽ���=��<|��S��k��8\�S����[ʰ���XBo��Umy��Y��Qb����N�~�z�����p�^mi�!��i�H�Gm9f�U�n����������u��߶~e?T�G
�bR���蓢��J�R��;���n��*G�	|Ew�&�z�n%R��k;�]����Yv-Ym�F���*�z���v����u�^�厶7b{ސ�����y�~�6#��\�KW�`�4��u��a�%xi?��7��[敖�m�j]�)|�
��¦���$N� 7E�{��b�+��3�vG�- cE��?V��q����[D�It2j�����!5��h��Gl�6G�p��-��n��(��)8���+O�ͥ�'Sp���8�H�lk�s����J�a^��Ek� �������<^�/g��!�JkK�r��N�ON)����nΝ�w,���W�,�Cf_��Qm=�'PmC6w�zl�}��Ԇ{�]7��V�����_��ۀ����3�,��b��v�|�i�)e�@���@��#Ө6h�*b%᷎To�/�w�y_�?z�qG�j$���=���oQ�J�����H	��(��FJ�>\� @�&��`չ���+AX�&0�/wq��e�u�i�KW�i��{nh����e�~�;���?���xb��PN%p�u�!x@*��ݴF���6��^>����&�MU����t�ų��hWv��^�Ѓ��Fa���w�bF52�v\��.L��퐅�M���!����0�'5���.z��� #d�A�M�P� {��r��@�r4��0B�9��Q��	I;�Ob�¾��b��(�K#�\���h����u~ B:���ށ�u0B�Ӈ
k��)zD@��CP��N�PMb�����"x\5�x�n��n3�H7��Z�tv\	"���P�9��FԽ�4�2����X��9B�y
�zp�ɹ�1�M2�o��]��$��[�6Z�Ꜹ}(m���g(q�*��Y�3cᤞ���>�x����d$庻)������Q<l)e�'����T2�h����]��������ztQ&�q@�rK8���h\?.ش�VY��� �*8x�cՌ�q2�xL�o�q�����MB��-��-2�S|#!�b��Jܰ=��΄:d�7�6�k��{�l �TSj�`ק����w9�f\�^m�U �8M��o���7ּM���b�
��`_u�����61:e�H��U��|&��� .�\�)�#�[����O[����f?@���G�.�1"�\��� E�Q� ?�È�� ��%]�Xs#{����}�7�Wku;{��Ğv�fb��r�>���������/�H��^�aW�N�z!��Wu��O3�=���h[�z��7���u|����0#Н4��0N#��\�6�Ĵ=�K8}�z�'�W*-B�2���8l�w�F�N� -�����%I�G��F�Q_�-���)<�a,��|�&�O�'8r�͑�>]����P����fx�t��QĈ91�@�4Z��<z��u.��D�o5�-`��J��O�	4���y|-����o�Q�3���'�P�����?.��0��1b��Q�ݱ�7N���g��j���:�a���b����n�?��n`��,���~.?�?)gӫW&)K�^��%Ӱ[=}s�=�s�{����"�ф���.�x&����|n]fz��{�J�� �ߜӿɕ]�7X�����W�x�H�ӽ$_�h��Y>M���ҭ{it���b������A����}�Ãe��'0�i�\ћ8���1��y:���#:K�b�i�1���o����W��Qq����BO{ZT,�t�å�O��{��<*���-���fP;�$Ծ�_�[s��OO�U�Lӹ�|�n�Jg[��ey�X��'�dOcq,.�����At�uG��񟥛�(�X7>��>I�	����ؽI^��j��i����l!��`rl|�����7"zh�.� `��q�d��`��%�&�/�L_�S���p�P_�r�[̀�p%����xY��ǩHm�X&���tR�yIC'"�    ���tv�g��媣{�g�5��/�bV��O���aZcw):j��7�,���v/cߥ��:=�����P�Sn�w��w�l�g��g�h�o�W�z��sQp���1��i�h�$�����dI�^�i���J&`<��{�-Sv���� �Uw1�Q�K���*�Ć\�\@��x�
���*O�������i�	.�{�E����]����p�P̡Rc���r����KЯմs��y%ub��4�ʚt|%��f��Q��]L�<��!':W&�!D�AR�(��|��izY]�y1W/T�]s(%�h���`�Y9l�䊥�4��Wu%7�t���aM�N,��q	����b����׽���b:��a�eܹ#)FK��l�m%��MSNO�8�6�4R�z�����Zj,:�������|��4ɧ�<b��'���%�`�|����E�m1ԕ�֚W�H�t�`�e�fS���J���R��ջVϻ�Vo�=o:g������1���(J�b�1�J~�w���$C�xP�����b�����]4�.�C[����UuT9/�36m3�ʕE�E*3X�x�(ͦ��W���Wz��U�,ĭ�}Nndw}U������f��MQ��{��4׮j�TՑ���vxS_���4o��k���BO
EIQ��DX�t��=��+������_��PZ��S��,���-��6qp w� �R����$kiȱ�U�3���7i)
bV�ms�}�׍-�B"x�ڇk��V�$�����5I	~�Kԁ&��J�UcI�j���U?$�k�vU[�g��'=�U7���R��i���:m�1��)���!*"�o�Y��?,T nC�1��4�U�M�g�4A�卆5/T�J���1<��Tz�MRp*�
�j��a���gd�Z�7@����X�t�(̀/$[M�{��f�� H�m���Ѝ�|�f{%U�{]ǰ�oEDF��BC`9��͙A��hʈ��)�F{�kT�@j��1dK�b�JנX�୮C��C�l*�#=�Ya�Kt���WB�d�+�Q?Y�YJK�`����hT�Uu:nޠś��!��~�I5�������eS���;�UC n�G�D׿R��Ίҏ��z����e��Q}�N+�=��+�`J|�٨�_���Q��6pEw !�xY���z|�!�Z�!^/�9♑����8�/��A���ᙨ8�����7�nM�^2��h�ąm����YtV�c^jC�H�Xa�������ժ�)q������*Pvɴ����9BEL�f��B~B�N�V���DX@�0�h=@8L#�w��DZ>5'SӯNx���Y����*���O�j�Z+���f����p.�7�E�K��V�ڬ �Z���3V��V<��-*��:�5lyTe��Z3�FH��x�b1�eZƓ�H"�`$)Pf��ޞ6)L�5��w ��U�j�,����#�6��?����K����^���6�yV���{�����0�Ke:�� =��:U��;b�l���z�fc�=6rQ�r>
���t��b\����~~�;��ܡ���!L�W�C�,Ӭ�!�~�R��
���4z/c�|
D\�:^�����H�����d�1Ү��}��w���ő�s7=(R�/팴���(E[���7�넇�>+�����9��4�������ݓYTLw.k�Xi��hw��
������zʖ��+�|Z���9������k�6|+�R�=���z�����&����ڽ�:��r7�^L +L��'B��ɷn���{�W����H���e���$�z��%���?��i���K��3����,�f�kwqV���e���<SMvo����;ѯ�~�?���^�������~g⇅����'���(rݧ������x�β=�$��Fΐ�?�i�ܟ�4�%��jMy赹0��\�����::��|���`���l��_�`�|҇����f��.��m����C�?��*���6EO<�����fo��
彃%;�D�*��'��-�N7<�l8Z�z�O��wL`�6ܽ�l�X�R�݆-'hR�����͆O�)x�=���*$l6ܽ�l�Lٴ۬��`��j�v����_c�)Ԉ�}���o6�X/Ӟ�M��e���~��y��tu���pԣ7젷���f����K���7�y�}�+�V���Gw-�ĭ1�a�S�d`��l#?�~��\n�Y�S�\�mK�2�'�l�E;�/۱p�6�T�q�i�Yw[j;��X�ϫ۴�uÁ�����>n�H��?aݧ��cƜ�������զ�Wի-���W�>gu�6}�
�A��T�j�������W>?���/��;R�ŕW������7 mF��&���_�t��1m��CA�a��)�G���/�^��F�v�5R�'@�*�.��z`l���M�N�\Z��P�Y1,׫���2ؒmaKV��C-��2��~ͦ��l��}h~ڡ��5xqs��z�?��a��p���7gH���
{<L�@������b7O�R��P3���$u�e�g���-�x<��� {���E�n��1�@+��i2��=��l�>n�#3��ڪ-�N��# ^s#���C�w�G5�)�����l"������e��	.��vV�=���::����������/���}n\��E��E`~�%>�浣<�w�8����Û�|-9��g)�5�w����̋������ݻ7�g��%��h{��c]��~�xF�{�����"������O��P�����	�o웎������-Ӂ?�q��-��m�`�/ޭ��~�������&\��7ۼ���Ǯo�֭N���'��h�QP���γ=+�eK.{�.o�}A��3v{�P]�#��I*ӊ_l�vq��-]�A4�i��7(?~*|e���߮^m�/�-���g����~�xa�ی��Ȍtww�G���5ջ��&���J���q���oW6����Gq�;U�2���o�A�;���A��z[&�]���h����g����=͏����=��v1WC#{҉9f໑���u�HM=t#_w]+I�#ǵ*:�\����'��s���^�Y���6)�(�1e/�/��~�,SJ��I3��{��I��9~Sb~_�9F�ǗY�V�lG��xs�k�MJ��J��yDD�+J�EY;(�u� ����j�m~@i6��JBI(���H$��B3Wf��xF�)f�ĵ����E�BA	�dV�� D�\;�Y���'�Io���?�(����L��6���b([y&<�S�4R"�Y[Ih�F���d�l��g;A`�OC�n�7�/۱M��9�g���=I���$n�>h#��ㅦ�L�ѭ(�03�4y���c-��ڵ���X2���cj���۱V',�^_�&3���f��e���!`�t�h��<�٬]Q�4��gIʀe�/ˈuG�8�m3ǈ��SF�}��:'%e���2Q��M�8Pd��$��>e��D$	�R�A�:��X�C�{��q�v�rd���i��v�Z���nce �yx^CQ�6Z���$,5AGJ62J�|��3��M�䩜�,}��&m���(�~�5e|��߄�rTn���D]<��
M0���F��GD�*J��v���r�P2%�\�=�#��#��3\�wO)Zb苗�:±��a811rd�%/�l�mv4�$6 �P4j�f߉�8�a�}b3 ]�44��H:���/�0 !v`���i���~M�&�L?�S3�[L����}ψA� �lE:%c[���"#�`��R$f�$E����)�s�W*a�2<��l��ۊ����j�X�bwyn25�J�'h�	*P2=��
�^�Y�	�[��A��F�A�-ηT��|�����9�D��f5��	��~2&ɄLL|�PR6[TȋY�(� Wx �0IY#�)�F�1���0G�}�]��1u �i*�ǉ�P��գ�p��{�k�*��0�P`�e_FeC#��R����#��tԒʟ���Z�
 8�RM�5"שЋ��*    ���?2��.���c�ri��I����C9E����/�b|))����o�ݬ�WUKFq��ԡ�I`����V_��3P�A왺�d��$����u/N#/�8KT�X��܄D�,eqH�	/\��J��1�;e��l��'{(�a�d)AU|���U��4���~]���f��
����싰���G����Rɱ�)O�c"�mN�� YAa�>��m����
q�&o�Qq�����B䔰��ň&B#��`1yZ㈣�:I��d-4�B�E�pI����	���ay��k�ό�
D��t�c�B5��I�TSEl��f��<a��(6>�5�n�#"�J9T*��ļ�|��S�����q���9�
���]'�|'ֳ, k��T�e��Nd��F=�����L�KZ�P�D��&�Vr�m�>�g[���� �F�FI�j�Kf�f�� ] �93�������'_<��jz?������;���k���0z�eL��C~tc�l~P��D-��_Ԯ#eDE��<st�9ybP�Ec���U�����j� �6"��Ϋ p@Rg�i�K��Ʋ������s5�TTV��U� �C�	�=,K�:�v��6L��ƿw�.�a8�;���	.|� X�|�%q��f���a~MY��b�"
�5�&h.����p���k����Uq��.aU"B~B�8-Ɣ��sY�HZCJ���:�P7͋��r��5r�	�ܹH�4�Jx����~��C=3�s�4����06S�S���c��ف�������A��ꅉy�g�Y�*�v�M�Ȝۻ�~d�t�/����E1�i���{�Ĝz��q�҄�^.K�$�R��GzN�|�w,�i�w�{帾��z���9�y����~�.t�0�[6s�VI�GVk{��8P+Sp��� ��ώJ�{��R�z�i�Ѿ���U+L���=��@��6ӰW���H�5�!�X�
XJ=~ |I
�Ya�M?(���$�����
C!�"5<^p��\qWve���Qc��< ��7oYN��.=#�J���U���'���ᄲ����D����3>��
��{�SQ+&�l�Y�n)�
��A@0Q��Y�C�Zv�ޙPjF�;��������,�:'U��!d܁���T���L�ˤ�����%9�yU9��?K��&�u�����k^��ls=*Ip��E?d1������Q(}ת$I�\��46D�kَ�uk;(���$��E]	��Mc��o�Ŷ7�YjX^��rI���ơa��'�Z��V����6�Z�PS������Θ�F�{<�X`{'�t'L� MA�ǎ�Ji�{#W#*e�k���8� 4���N�_Nq�3 u�M�q���3t��ԵM����X|�H�Qm^O���CLM������<�6j�C��ISЄ�bqF��Os��j��$�$M�TOL��M��L2en�I�xC^������~�
'���H�N�Rrp|�t1��#���3�;� �Xf�zh$1 (��3t?� t$�����I�qڌ���2<�!.�/��Ҩ���?⢇�����Z�_؆,&E*���)�GN�=)�=1(	s_I����?��&�Y��$n�p+϶�4�t#����FfnG��n_���h7FY�Sr���CT��u��šJY����Kϛ��
J�&Sp���Z}7�b%DLU�P�L߲�lQ���5�!@0�5��4�̵�S�(�B�*5I�Xu�BT��p�`�>hO��"ٖ¼�r�n�,�T��c,�'+c�	��R�[(b�~�s���n>�2�`#��}��8SƛM���۟�X�~G�vr09{�#��s�PWTx�	��4�8�̥PK7+�5j��-(��[|�)5��Z":A�f�ge`>R+ҙ�:�$�ʘo��{^�]{���_���M�w�stZ��Á�o���8����C�?CCk�`!��μ�T��	�!`��j{��#D�Ԛ��$N�L!V�v�l�:y;f����JOn�p��d�Q�Dd��UO���� �����>��/�hJ캖b*z���N�]���R����}G��9*&�mc�Yj<���9ny��nW����s�w<�K�J�T�&B/fc ��~8����m�i��~�c�Q(,�H�O`R	��� -b}�>�SZ5$Ռ���]����(���AX+�XU����Ͷ��g�9� �'�+t"��vk�]I�Ɔ������WҘ�P�����"�׭��1m���'n�E���(���k����۟�v�{~�q����E��#K��h���˝�Vs]o�UJ���繞k�Ih P�Lg6��i�vj�v�����"�0���/̫(+H�.2"����~8ar}���	���P\-�j:R���T��$��Ӣ�o�E�܋T��bo�����x��#Ŕ6"����$�E`#��̉"ݏ��3,߈}X��)�8���I)�����/%��}u��q7["�Qe�q�����I�������xM 4�:Zթ�D(���W�����t?a�'L��r7��K��C�1?�Hu�I�*G���o*|-�M�W�Vx��: 'vmTǙ3b]�\�:P����U�j@���~R������q\pCGg��� K��	��M�����`�]��t� 0 �xvx���	:�T�a�'z�E@��T�f�Z�1��T�:l�`=g�L?TR�xȽ!S,lV���� ��sq³r]� �y�t�����!?��,��Dv����_�R*�m�k�Fr�@�o����n6�������Z�L;v��4�2��T��j��V�o�j0J�8Mq�9���Y�z�nl���������1�)]����Q���Ƙ�;:b7��uD)�

��Co���T80j�d�k�|�����L,f�۩���ǽGHTMCg�[{Mo�X�+�,�u�K�����b���-,�
�#�uvTi;,����j �[e��a�~hY���Y��pUivBc�xր��}\��T�H�ȋ}��#������oj�v� �^����P�����U��7pm�
@����|�v��$�|p2L�^�b< i�d2737����$�j-��8�#�}�M]��96���ͻ7Fj���'�� �:nW�M�_�,a��3"�!+��Z���x`��M�]fQ|y�1��лؒ�ι����4�C@c��Ug$�����#�q*�!\�G�[���w�I,1�=�-�D�G��H��)g�|碐ϡF���}�	����Ij�V`꾛���� R�Ȳ�,2�(r[[�l��C�|,l�8�"#"&P����bP��M&�^���M�2�Vڊ���:�k�0ãw��� �k�k��Z��u�'F
�/��ξP�(qm����J���~�	���zb�Y	/�߀�4�(�@q:V�84H��Ӌ���7���x�{:�O�҄r*�#��@��a�)�)�"��n$q���ω�9{ "��&�'w+��3�/
튰Ok���RΔ�V=���jd�o9U| �T�Ɉ/� V��ěE=�4Mp�g�H�,�/�`����bZ#WFUHo��ݱ����<*NQ?��m&[W��a�Y>/	PցaB��z����4�,����"�U�U"���1�hM�k���!�n(��\�o&���чh��3�g�}�ll � ?�u�,[wp��/H����̫���Xa4 @����r�.A�w�0���`-���'σ��V�K�����SFό��E~�E��7p2W)������(�i�55m���,;ӝ��t�F�n�Y�[�I�T>AQ�ٮ��幞	z̷���M�����B+��L	�I��!z��:��x��t�3�C��ۅg���I� �������0�_r%L��3EȄU����?�C���{�g��Y��F�J�^����2��T,$km�����nb����!��)�[�lf���g^�R�~[[����H��܊���\H��<%�E�N1m�2���=q�����A�q�ďM��wM�St'uL=_,s����4M[��?���    �!�L�6$頃�����MK|f�ںi�h�QK&H���훷o��@�>a�����D9�����c��%���Vب�����N?��Ɲy+]�l)�jp*�Z��KK����#=�?�,� ��~�A�W���S�{b��% �l0��c�z.x�fh��3�$���Ω��c������(�[}�/��έ���|}�Ḍï�7r�a�8v�>h]�Y��;~�Q$z���;�r�)���4	X��IS�[R�+WI9�V+�ʫ�Lz��*ҟt�.��(��h���pUC�Y��4����
�ʧ�e�:nl�G�V��$�HH��j�E'[��	��c'���4�f�J7���+�6���Wԫw�|��7ؐ�XQ3�v���Z �ӎ�8�B˱��M��6�)���r2�� �Q~{�����r�=z�ãF`CF���]��ޛs��gCI7���"������u1�c��L����E���eN��$?B��S��o<e�M�^�. �ꦩ��f�{��gc�=�����m:�il[w�.�� z:#�#�<�BĿ|F�0��w�6�;�2^�p��@3h9��Lg�p�,�8�a{؍�dq`�nb f�"�Ů�q���Af\0-t���)��?��9��a�o����_E�}��{���wk&��D��?��9�^|�������l�:V�/v^�P�c+��	}+���K����n�
_��n	-� -�kR�4}4���^�N�/ ��̇t@Yܒ������z_�Ot�J���ڀ��7��"�M[���� 2ϹC:޹P�3T���fw�ۥY��Z���c�&¶m?4}�R�
'tC�ӳ)Py�
�-�L�|9�[ye���?�����u~���u^5J�?Y H�=��ɼ��/k2gҺ�t�FvyC�k����+���'��B��W�x�H�ӽ$_Q�,��T�Vܾ�F�y����A���l:Ur�i�mU��3�%�����ؒNo�\j,�z[{Zz�b�ʖ���_�Z��	�V�w��WU���nG6⿢V�;j����Z�ٔF�v�& j�|z��b�����j�.��c벸�ު
��n[+��w��s��?��촷R8�7\�Oi�	��Q��瓺���_����[�(�mcV}]V;���:�O�{Pk��wJ�껳���Ē��
)����i)ucl�:=��.7"�mzF��Z��)V)�z�e��z��~�n?�"�`�u�Iz{6�Z��.Z7붬��6��ێ=Ў��!�����Q$�S�6I���۝*�	�+�Բl#��źl�㌎z&$YM�KW6�U���U� ��Q�'=�L)�����v�ͽ��z���]Ҽ;�0)Y�-�v��K��Z�]4����}��u�[i��UI�����,*�(����i�b%�����Ub�`h��>۞ZU>�e����n��7ʹ�b�����,09/Y>4,[W,n�f��"u�vz%�P4c^���Jy�[��;�Tg_����h��@��|�H1ɧ���U��]p_���;�R1�oٷŴVT絇M��mǼ�=�fl�kٞѐ��f�j�}�v��v�'j�h��v4�*S=�7\���D�/$�fБ�@.�D��l2oK5 �G�X�T�~���c�8��T��\�V�T���f^,gl�ǀ��5,� ���+וWԒ�8��;8v�.��^!݅������2��J�l�>�<���R�W�M��TU>���zگ���j{=�:�U?�"�pO�w���-�,�Hd-;���`�}�$ޣY�i�)S��:RJ�P�&}�j�n���~���L�Os�I���X�b��zV��ܑգ�����mx��%�W��n9}Z�&G5�\�<Y,��W���cMt 9��K�K~5I�LW�0�g��_]�g ~�8�hE7��V�O�]���B4�[�ڲ[N ����߰P�����4��7�h�v�^�\R�f��&5��r�7ӣ9�>:�SVwU�ts����mɆ����PX:[� V�����6���Pi�P]'���:n4���<��y�o���;e���*��Qm����፦�ZǍ�`	��Xp��U��v4V9�,�2E{��Ɲ��j��P�[���z��<�|���*�� ��AÑ{W݃��wֶ��>�K6�g�����D�T4�5[�e�r��#Ԭ��8ZM���j�?��2�];���45����	�U�F�ۭ��>�~%&ڷ��H�`�����ч-8�"������W+?�9KC,�n�$ʄ?]y5W�
f����� ZynG�����
P��U^�P�%S5�m�R=����I2���E�z����x��qK<z�_-�1ˁի�㉄��5�5��dV����!���@�ꘒ_��@���X*X3�oO�9�őF�����`qr�G���3���ퟭ�����a�7x�g��п���i�,��[���\e��
�wY��%��.��>�Q�����QQ6�-�j��*�G=��I�	Z�˴���F�tî�]��h.�iqoO��nI��0M���6_��Ut��'t�QBgE��=ɗ�o��z֍�Vm��P&o�i�fjf`�n�X��#~��.�����z�M�+V߶/^nN��Lc �,�U�G(w`��6m��c̫�zZ[��Z��oŉ�89gl���a�1����]`��Rb]�VS�T�:���"�F����NV �#�"�WX|��~^i;wӃ"վ���H��N�R4�p�y|S���_�l:���׫��+wOfQ1�9��4ƿs��D�����l��T����d+h��>U�Ǯn�Q�ՠ�t�X/s@TF�H��Ñ����>����bZ�J )��|��O�=�O�7��{`h���v;R�ҙC]$��i�_B�2��\�������>��.�Bm��v'w��^����3}�ߛ�����N�뷟�K!���I���1���D��B�տR��j/)�M��.?�r���,FOC�>�<������qb[���Ķ��?ǉ��&� ��%}İ�����m�mx�٧?������)�`�������?��nŋ*�݊3�T�ǧ���������<�7�1���*r���SMK����
�;�N�x��+Q���/[0`��=�U�3}=X��se�$&���x����t:-�te�ێ�Z�fW���uU�l�ߑ�x8�O�#���8��`*
��2{�P?��u�X/Ӂ�L������a�x�����FW!� �o�=�?��Ѳ�C
�To�7����!����]No���阸9�?�V�$t�fl1?��-�ui�x��:�\���]��2�"
ږ�ھl�>S��\m�j5V�,�r!z�5s�A���)Ֆ�l�n(y}F�  �.��&.?	ɿ2�폘��l@5Z|�Q��iG���n�Ξ��T;{�&��\O�H�]}	f����5�jWO�T����eGf��\v��fW��d�E，f[���lv���g[���t�D漌'?�̏&��s�ճ���5\��?�:zc�2=�'zzij���-���ER�od�Zn�ʡ�m۶��������M�������6����-_Й��]�t�l��CV/n�	���ذ}w��ژb�C����V=m�����c̭W�a�6�ڠa{nÞ����ckzl#��Ir��>b鋘�fS�������Q�����hQ�>��8��ͩky�ʫ�T���K���3��?If~Y����ҋ~���@@����N�J�GvWGs<�^��E�����.����Eˠ9]�o\��\�j^;��{׊c~р�?�i�'a��x��_�~�+~3�\���h� ��޽�={\,a/@[��4������0:<+�����/��
�o���U{�DL�S�xc�t��o����n����0to�5�m��~�n�χ���l|�7����-�?v}#�nu����8�[k��
��w�"W�~���,��q컼ɓ�u���Bu���&e?L+ޱ=��1ַt���YKVb�w�H�ʮL	4�BI��H|�s�ک�)��̷tǴS=pX��V�߰�H�cI    ���H�s���*9���T��:�2>�ߧ�NH��G������/��1V�t�e�S�m��J�5^C���m*Y_C7a�Z��c�0?0tf��n�,�Yʜ(t�Y_�Y4��>�'��2s�)�&�([�^������]��5�ݘ�'e���f�޵I�F��?�q���U�0/h;��0���E��H�3�1{��d6���o�>8iT��Bǘ��f`r�veo_���	<ߤp�k�,��I>��9�����3p�_�>?X9������}@.�l��go͛}!���e�d�IF�煙��<�SR�W�=����X�h��I	J�ǫ�Q����� 3�����v"��$�TO�1*����Fb|��9y��k	eP���Q��UF����Sb��<U"U?�*���x�,�,�(��`q ����m�0��ur��5���U�"�8��i���(�:�����Z�
rz-��d�dAU�k��J��b��@�f6�Zǲ0�1(�0+M?K{j��9q��/,�?�<m�`�IM���\��o�(�)�ޫ�z��)�@�����nN"�z����I:fZW,���i���Wе.�֦�F�蹝���=?��B��j'���"'>���￦����K��^M�O`-�w0?�:���w$"_��;����Ƀыb����[�;.�T�X�9� � r�s���B��楐"����9;�t1s���N�]W� y(fkO&s��0�:�9� D!���<�*i�թH����2~���*2�j�ǘӨRT�����:���,6��m&��������8b��Qzt�^I!R�S�(���� ��:��dTL���l��G�V��]��'�-�,��%��O�s���'[C<Ч����*3bv�b�` �9�∤���S^S��X@'�;�dϔ3p�h��x0'	�$�t;�Cݱ�LyIu��ꦑF��L�TII�'K<8�Z#Q�b����~�%�)>�+	@yS�� #�n�3��=�籰��U�k�3y�u^eP>"���E�� �QUDl�aF����I(�q}W�d&BQr�r$�<tOC�$dI%o:hVZ�D�c��1�QVS�:[3,Q!S�V¤��١��!c�g%��yV�cP�q���]�e,
C��2�E���T��w�EE��'�4kJ[�	m/�/5Q�f4��i��<�f�`����vɚ�qSS��R\���I];��rъ�釔
���uB�Ѱ\�K�B�Z}��be��0�$u�$����Gib�_]�5�}�,ʫYRzp���׫�c�2T8�d�Nl�U�,�*�Zo�s�J��1�<����zϵ+4B7̜�*����P+1��9{s���/�,T��q�i�׋�q֔�h����+�T��^߶�*���A����gY pŴ�����x�V�`��îݦ��ᚤ�*2��d�)��k0����ԭ��e��.Z!�m�Wo��O$O���z^�oW^%uR������R���z���c�BaN؉��T�l�f	���t?5�I,�?�>�e�~��V���/�����I��,�<�����H&�AN�\Êl�J}/�};��8��I J~b󹩑�Qz�&wF��0Hٓ�J�S/�HƜ�\�HD�J�S3�H�2��,�a�����īKV��u�.� 
��OX��U?�����y�[,E��^��P�������nb���FAjZ�c����$.��s������C��Nr���`X��ۓ�
M���� A�G!�+�f/
�Ջ�ZsO"�	<�2��y�E�XX3,^A�z��	�U|��xxH�c�B��pG�S���;F/�5��e�u�!*ԍ0)�-����$�u?�,�,	�jO|=���"�IL�<0�By5Qœ*�0�_ݎ�I�QcCzL�ԃ��U��,^ZHu�Q��4��d2܆u2(����W�J* ���r��׸�q����b~��uR�˨��ͼ8��'E�@�zN�=�ZȔ�&�����	�Ү��q��v@�q��N5� �8`:\fƩ0SqT�!xcSD@@�9�dylr�ud���R	�%��"I��V�`S�3�$N=e�iz �Z2'��H��<��k�;+)�(�J$�)�+���F>�,�s���I!����*�%����:"ˑx]��j[�l)Ʊ��gV;{� Ʀa��LYlf��{�@�f��v��4��*˲ҙ& �H���FX�$Q�*�݌,!���&��R��L�F���X� �Ed�y��
H�-��lg�5
�8�|=�$1t��R=r��&��Z�ynr��$R�t@��֢D���)l闱�d��bć����[¾�j�㌖��:	�������-xh����/�2�E�5�3=2�=���8:��9>�tFE�y�������]YI�����GA4$F�j�x(�y�]?�*�  #	�m^����q5�!��
S�/^J\�n��Os^:����_J}�d�6�"�PMQٿi+^P�!�I�ࡤr�La;$���:[�����6�TH/�.z-7���斁��m�^�LP���0�eX��q�؎���	=~w��E�2Ҭ�|0����;�����8l;�3v���:���7�Tw0��u��^��n섡Z�J:��/k��E����Im�K^��|���oa�^�_3�
XF�]مQ4���g,c���F�b1OM��c�1��O�o�5�AR\�K^S����ރ�+�b��C��}�Z*̏9/�2�=��q?�^�`���\>�֐'}�K��c�~��u<��b/�+�u���e���ࣹ�}l{�A��<t�d�[�y)J�R����?�7v���MEm��b�:�J�k��j������!ua�H�	%6nl����152��` *�Z�����H��'���sΌv���5�Pk=�6��͸�H��G�-��ڎ��G�	��َa���mZ���`�۲د�i閼�4�ʫѢFh��36at#�� vR�2�>�$?5 ,n�D P��p%o�B�U��<>�B"������(a�0t�2�������E`u2�==C�͔E�UК(S*Fb����e���x��n��0��h�P�Ǩ�d���	�����$�G��E\�ϮOt��c����?~��K�g?>�?��fk��N��^d���`��d�Ɔ���gx�N��L%)�:l���ڛ�ӏ�a��i���.��8>��6����+F��R��0��tM�6S�~�"�<�봡�^��WkcI�`�L/����<�͵��@�V.�{����ci���W@_쥩�P/Np]�,����u;p� 2B�J�蓓U������|�>|V����lބL��Vߜ׫ʡ��2��iMn�������t�[�TP}G{��jNT��w[�2���~bI�ar��:K[w=���V�ڵ�%?�E���܃:H��UO��r�g�j,!@Ge�ǚ�wDD����qIGnK:Z�n��Ed7Y<�{��s<��Ϲ$l��0)�M�+1�M�6�:�����Fs!Z���U�R5�ޞ�s�j
��"5����4T�[�O�>�O9-�K%Q�;~�ǖ���$a
 ��$��شe	k���cb��.B�g��	��,E\�R� �f�{��g9��������$�e�����%�Y�>3��6���\����[��Ǐ��q�OO�/5KD	ʓޢߜSrzPkb���gD%^<W��p��ۢ(���G2��z�5���ڿ���'6���v�Ennp�������`W3�!��6o2_L����|3��[7s�[o.���r���������oϾ����v��Y��{��aX���5�]��Ø���� �#u��1=M�$)��ul�s-��Loz�{47��}�\������A�Tx�}���gL�K%�=�6��yS�;!�+�u�p��΅�r].���7��sВ?&��>��"H�n���q�X㹝�MW`ʠI�c�O�|����=B���^8��щ%t�>x�z	:D��ӑv�����پ�Av��2����8� �  P��_Oҹ�+�&�q���"�8�
��ȃi�栢��峢�ՊL%���G>%���&!7tFwķ`���-�/����pD�쫺_Dɫ��^�*|OFAG|��D����Zd�}����S�1�P�!��.�����"M~���6�<���=ch�r�j�P�g�c�E�v��3�3�	�$$��3�����#��X���ך���cL'|�M|��~�t.�*�j�["�	an���T\*��A>g�Zht�:9xqz����w� ;��;�޼a�}��Z�&p�#�5pK�1��l��&}T���I1(�_'�������Q�.��><5��U�7�������U��O.�4z��́�{%[ '�H�v����i�@:��QOL+�')��#V��Ý}PsL����~p6���i8H4��Mڍ�ـ��t����}�[�����k���8�}3)�ưa;����H��O3�A�nU9�VX��o}���n~+�����_y��B��㨬㝫'gq�ZΏyq�`o!Ϛ�N��<�!����c�[>y��(���U~֥�ߛO���VPu�*f�����T���H\T���F�������yF��!�F>:3K�w�*��m�cJJ�����h�����|��'l:��#��5t���'<�K�j,�ydʅDn$���ґ=�e���ڝ�ׯ�i��r��j\��5D� :E������)�sDQ~q� ���}Ȧ�Q���'(�Ҍ��#��z�ۃ6��m��L�G|���pv&Kq|1D�Uu�[�~c9��X-~��cs~�Q��sc�Y�{G(C��P�c�A���	�ɣ�+:��}~�ꄯ4��R�_J��qo�t�$t�N~�@�O۠�P�QΩ82��j��r���S7<�0�Lc��>`o�A���W���q8I�      <   =  x�]���1��(ֿ��1��!@2�˿đ�)��ư��!7hˀ��`kewO�/FV@������;*!�ZND����6�6}����[c�)���7�l��"�$[=�0�!	��f�M�.��MOs�	���Mk�(=�����̉��A�m�.�6�h���$7�E�b�T|V'p�s,�4h�>d�Y��Fw�	Kw�b	t���[K�^�/��)�(Y0JH�[e�-y$Ně}�#�<$Y>��>/P;}@��ac�UśF�p�O����8��� ��{ ]����,�L����~�_}�      =   �  x����nd���3Oqr��]U}��	V�@^��T�84��5g��b��p��o� (0(P�
P�{�M\�����6�p@3�]��W����
��<��r��*5�ש�M/w���rqq�����m���͋m�~z����������^���g_\k�x���:�c'�q�ԁ�ח�a��>:g�(Y�(;��
�:�P#:�ƿM�0�.-��BY���sӘ0r��FB)���|�JO$G�n�������ÿ�_};���������������������<ݼ���L��P���AB@�l?21E<����=��K��-�]f<����������Ͽ��n9����W����ݿ�l%��:��A@Vx�B�h�y�ˏ����
	��RC��M�2@��lR<�a�w���8����)Dr�r���'�����O�^]o��UL��x-�:d�Hk�اvСc�yU0��|����){ȉ��B��"�~r���Ņ�h+1E���T��#d��;���A�h9�D�:k �����3�|����JK�m�0D:���ۻ/��/6��yP��YVԪ�B���s�u�����qf��ʜL;6x(h
�ѓA ˻�$Z8l���jI�^��������B΀3\�����p	�ؙ�Z,�h��l��J\Yz;�]\K�P�������@Pu8�y7�[:!-���m�� �IG	��@�n�vM��斘�t��i��>|���mO�b��EV��)�?{J��^+�J1���P��ӡ�E�$AxBF��]FFib��1�V�V �Z�赛��ѹiF����?9|s��w��������o����np������Ors��W��{�dz�1ښ:}���)�u�c�=�7��8�1�-O<�����;�neE�����pyh����[��yZv��?���fc��MsSؠZ���������=���qq���'Y���û7�-��,����YW���:z豕�����5�|���>{w�@q��ߨa�&L�7��#*ļvV1�`��@�*9.����'����9�������=��u���9T2c��Zm���%YG"�h��s%����gmJE�S
j�O��(�xPS���GX���y!�b�Ho�����~�G�y8�yk\v����2���sӃQ�l����0ںYW��#���(3|��T�^�:iko��3�͐v1�g)�cV��.3��9o�F{cT�E�z��,�h8�#��I�p�&����Z��|��m|ե;i
�#���1��)@�T�O;m��v�8�3���X;����V����ty��a2��y�D���P�-���B+
���J=/UɦA����lv��̐���錾���($��d����Xo�9s�"��l���CI\������9��^���f��4
�      >   K  x����jA�ϳO1w����{n7�1#^��]d�a�g�x1�
޲��c���;��"4�PTO��_�nUj��[06kP>Fp��HH�2E�4��R��`�	�d"�N
�S9��`G�@� 	д���Z���ɇ��������i;[.>M۸��v��^.��^l��z4=�N
�ħ���񓽧�/R��2�c~e#��C�RYs��G����*�R�W G:[%3=�O������U�n~��gO����ٟ=؞L�ޮ{�;|u:>::8|6>n�(�R.�
�"���D�d�A5�)Ԥ2�(#=x�oT1b����06�	e��+zez!;!��V4G�y=�5jĊF
YL�[�S�lSD]����7$�!6ϕ�f��^�^�NKG$V�u%���7�L\_�Ux���99��]bw��AJ��H���+{�;�VK��;~�b|r6�\�.|\�O�C��P�j�Vڕ� D�@nx`��$ے�y�;�^X�v�x�����)gK!�O����Y�!Y�RsH��7�y�b���լ��|�؂U=�(�;.���z�L���F� _*Y      ?   &  x�u��j�0�g�)��s�_�Y� ]$Y�6%�z�ةS�̥�4�B�@�$w��p��oR�:!�1����~�α�!%�3Z{&ED�B��{h�l���d��Ӹ��a��țn��ݴ���ح������~�}���a=/�tX���a�r�%�`��r��H�j�#PY�.��Lɳ�/�hQ�F�8����a�/��6�/T=�t�Նng����3�g�����рj���(#���	V���([���Lj��*�3x��Z��k?t/�M���DD�e�ϖ��O��Mw߷�#	��
M�1�ik�WRAx��A�ڲ�b�I�9g%S2�h���aE�_w������0��������o�%3X2��=�Јr��8e��IQU@�d�	���&Ŕ�Xޗζy!9�7d~�.��p҃>E�H�p[��hp֗E?��)Uʚ�I���e�q����͓���z�i���~���v_�����Q�j(M]�[�+~-���eP���'T6����Q����o�Ջβh��p���m]U�_M�&�      @   �  x��[K�]7rWQ�IO�Gd"H����`;����D�I����"���s�@^�O�j9Ī'C��`�H��'�s3�'�I�5��$�Щ� -��[ߡ5ٶg�)�.�2W�%¥�jaG�5oj����P�Z��5��K��(/�%N�{������^�/��/������q����(ט��/f�I�޿��Y\��n�A�D`�cZ�u������K0����%<\t�U5�;6攳)R��B��g,�}����~�_�r��\J�Ћ�-�TF�+O�w��l�l�5�����q��م%g<����+5D*�6�e
Hp	��s�S:/���2~)ޓ^_S�0q&�o�bs�Tk� �'�!Fʫ��|>�?xb�'�Rvx9Q1�Ӻ���Y�H��rc&��Yh6Z1���o��xј���,#���|;�8�\ ��$���N,�7?����Ę�^��%e*���ڱ��!���k2��;�}69�/�9,�DWlA�I���/Q�1a�UT1��O
q��LCl���v%���z�/�l5�J��&�&#�$=��T�H���/ɕ+�/����b�x2�.H¢� ��-��*����(%���"J��^9_U.Q���\2Ot�����&H��H�����<��)�r�v�����VC����lA\
x&���;������ć=�,�=d��SRx��؃���u�3-�'�q���%�D߄�W���M�Bݖ���4�g�����2�"�u|���W(������Ƈ{a�9�b=������I�lc��*��+��b0�!z�@{�� �����|	2�Pb��a���1,)�g��m��@^Y�**'����1>�p D�A/{r��]��ր/ndZ�JW�&������ *�#A<9��k�}��b�N6zHp h-���D���]S�Hxq|#U��+�-�)��J��oݕR�<|�)���!�\|���\���wT��D���F���E���;H� |�` �lT0�vD}ȗe�P�� ���2�#�!�"$���+Z��Y����U =m ��PY���EY�� �>� ��fm�v�o^
��_��Aй7A,�I�6D`C�="��fd=�~ �q�]�Q�I�	A��#n��H�B+���{QF5�X�^��Х&M����0(�Ձ����J>q��Mxr�+9�UP6�r��9�B��7�d..q��>�Mx�B�zr�M��&]��c}&��\Х�s��n����?�^~���ﮯ^�a���7o?��߷?��2�~�j�����w�~|=��W~x��W?����^� � ����J'�����^���g=#g��-�\���˪h{P�3ok���_DY|�%�%�ǾEc/9w�1�6F�1������.��r���R4�p�T�s��}ZL�4b� � �eDXH7����A�W��	�Fs���.�r_k4R�s���!���=�V�h�Z>w��({�"��B�ŭp����j�k��QV��
�rL��

��A����hw�Y��z���N��[�&� ��������i 4^�^��Q@��J	۬�cK�;�0e�ZvZ�<g/x�H���Dy#]�۲��"�#݌�n�;�ǘ-#�c&�ձJh���xx/���WPh��k�_�����W\W\�S����Fp
6a:Qb��X�\h�����^�;$�>�l�P3Dc��g�8K�ЙꎬbC�f�РD�Sћ��pv���٠��q� N��)W�J����<���y3	��v�	���OlcK�Q� �(�F�s�\��ݼv\+������0��F���%�7���H�P�83�B���+/�Y?�3�	�7훏�)�+��碐yA��-ϙ�@��Ʈ����hL��L����O�I�F�Hu���^a���!&x*Q��t�Ts:��yΦ�����-|T�e�,�_�����iC�����v�{�?���$x+�v0v��E6���*�0�oh{h|����/�)�r%�XU*^"�R��G^��|I�f(��:G-e$9�������-�/L��}���JA���'Qmh lHM�ǽ�~ξ���|�'4e�&?H�=�Hn鳏��h�h�ֱ>�Y6�]�m�+L+m^�a4�hE�LmP�ڶ��l^֔���@�xw47��J�yj/�Z{,����kɎQ7�XlX�QE���|���ZE'<�JJWGH�ljz4M`s�M:}�,p�u�@�d33��ŎZ~�
���mZi$����X�Q��4�/Z���ҹZ�6�!ŝ&-�c��*ӎ)�G;H�F�lL>�>�]Pk2A���f��S��in�hݞ��>���Vwr�w�������J�����fԙ�{���@:Fi(}��p��cE��_l\��GY��h����9Q˻r(�W7�	��5rMg��|<.}�w\����8���`�������Z"�a��?�<�(���o��������#�re?އp�x�[FZ��3�;�N����ջ�'�x�݃���|�qT�{�^~�B�� ���t�D�d4�]�l�:���8>���9k���oN�u�f�K�4z��Օͮ��i�łl"
�WMıQۏ��!�*��5�M�M�pC�M
���L�6v�j�	� v+"��3�C�}Rz�w�z�t!����z�[���R��W���^=M��df������ݏWk�V7$�th��T����o��O����A{��w�	�T�b��%U�ʵ�3�]��	'�|{�F����?�~��������S�z\n���q񥏅�Y!�_|�~�⧥�*J�)�y�H����߿���翶�-��"��괽�A>�>�@,�eTC)���N��D�d�|���ґ���A&���m�[Otao�<�w\3!��#۱1����~&6���h�:�8Z:���ל~��咲=��B �ߤ:�e��A4��`���l��z%��op��Wm�E	f&�d�,�va�Z��(g��y/��B5���cZ)*lkg|D��1_��{��<�m|�b5�q�:P�Fݍ�'L��x4Ŵ �Y���-||�|�	���oeM�߽��ԃ?&� I,O�|��ns�?�}$�%�?���>���_@���m��@ǘ[(��?�a�����b�,H9��N�{�K��v��{�L'»����6t�%���I��-Ĳ!Y�@�u2��=���op���@�~�3����V�C$��(�\[�c�ؑ?���^U$�8F�u�iR�3����p���+�$-���r;Q�'�����|��L5� ���#4C�Y�B��������ar�k��1���b
[�'+����3*�2���_.|� ���*ZDl͓��_���Crl��;��{��_�
X�<��t-E&|�^>;;/���j<��u'�e�q���v�jO*,ݲNX}<�У�sD���t��@ZY������x㝰k���-�6��;���@j%�>�`��v����xs�����;��@B3,���8���ٳ_���&z"��i�A��!�O��x��znc+�O	��œR<p��\&
�/��yqh�i4����'j��t�w�z?+�p=��a@����	��)�=��ڢ���y�ʤ��_���J��qaK"}��9�+�%�{" ��Y0��� ����-�M�V�#w�X�ʇ�V[�~������HDe�����n�_�ި�v|w��q�MǄ����}�����˾�����ŋ���:U      O      x��}k�]�u��֯8�'��S�GA ���@#j��0`ԓ���lyA ;Fb�@�$�X#96�ذe;/2ɗ��?��u��{������̃���Y�k��k���NI7��f��J,Hg�V:#��<�����0Εe�D�|�y�ElU�"�Q;{���7�$��q���:��X�����ѓ��!~��ú��>|����,�S�;��t�/����G����g����z���ӏ����G'�����GΞ�=y[r�����5���?���G�v�}�8Ǔ�բ<Ӛ[��7,�j��!妯;W��[��<����	G�h=��8�Ggg�}*��Ͽ�g�z���6���rm�>|�AK�F�!�K�,p��k������K?:{����R��Z6�4��A�c����;�%Ys�w�7���vܛ��_�W�~6���M��E-lb�V����Z�!V�����K������
��V<8�sn��e6�܌z1��̙�����o>?�F�u��d:��t�p	�K-�*}�Ƌ�A3>>=9�����N��*���A�c!��[q���N�����3ٵ���k���I��_�,�O�IL�pu���M��$��F��y����������+Վ6��^��h��ʙ�g�NL�`�z����h��
�K�	����렢tG���IL�PK
��`����Y���A=>��v-%����Y���lu֓�|��?��v#�&>m����3g��E>c_
�����2�f���t��^�ħ�=�icoHG��8���_����F�9p.���&��y�J�k/��|35g](!p�Lg5:���R[(I�2�d�Bl��wx�e��f�}\K簳
��Np`ܰ�X���h�uҕ9� c6"F愽����)��=*-�
���q": �ǎ����l|�s�>�Og�A.Ǐ5?�b�E��Vـf�y�x7��6b̾1���������e6��Ji���8�9Vf�m�5�������Oh�p{L�caV�hLx����ܮ�?&kl^���ϔ�`x�r܌���e�UlF�"�i%�d�Aހ���X*`�J��JΣ�B����<��+�7�������S1N���m�<+:K>Y���eY]��\I#���l(,�
�_g�6[�>��=Z1~�����Lg���ؕJ�R�
�+�<Ƭt5�[yL� �+c��X�A�c@,�+���m�5�1.ƾ~}{�l1�����{k���*�l�%N��G�22����>�
L(�=�(Xc��2�Ɔl_E�~�H����R�����`*���"��X�����8���e��J0=h�}w�Lh
&��8)��CN��Y���1�,����[D��2f� �Y;�M��E1_LtȞEL��˖���E��	Lvz�4�P��Nd"��P����O{��7^i�HE����4�E���^,(����_�D��q�bN
��W��`	"�J�����H�)c��c�/mV�,r4ɒkבdKƘ�p��.]���)�Uҏn ���A�7�DIf��4A���
wǆ�V��k�K���$6f,tRm�3̗~AO�e�y��e�m�=6*�$k1k�����gH#D{Op� $��hg�|(n�M?ǣvG��Q��hyF�DV@����k̨d�XAH�CBqBèP�Vˍ����1�֞ƴqs�`�rn�ե�AT���)���+�	WC���R��8�>����+��6v������-��Ϳu��#xy�F�ᭈ�#v[J`��%5j�m�'���������ǂ$�*9�VsX�,Ì^���>e�	� �.M0�

��3:�,�\��B�RB39",�C�$A�^�6��=���y�\}XK)0��$�h��dOޥ�łQ� k�f0�02Y^�<,M^vO�Wb#AѬxP;Y�����&�Ɵe��Y������YcX�� ^��~�^�\�
�\b{`Z\+Q���1��Y҉�f7�.��ľh�; -,�D�Zm�9���3 �����X���r�{݋o��Y���,F�$����i��3�B�Ά06�|��\C_���j �%��W���q��T沿}'��]�Ed�d܉ƙj@Z��c6�Q�ɨR��ۓD��۶+Ȕ-�N<d;������,e4.������8 �9��0$��C�5P��Q��R]Q*F�6�+H�f�_���������:�ۙ��1*2��´L�I����Д-.�=i�G�c�i���ƺ}~?�*<G��n�0��쳂�h�:b�#���줅� RL7N��6(&K{,`_m7�u_�^���N�`^S�N�X��Da�XL�e��IxL*<s��ֱw2���΍���z1�u?L��}��[��b�KĹ��
�{#���W�dpo�3��6��֤�}�RL׮��"�AX�Jc��h�|g5y�ф�;�z�f���%[�m��"�-�GhN�ĊM�\�'L�{�*
s�5P�o���&�7�@�����;�-��g�66G	x��T��
��-x�ޅ?<[�S�Z�
G%!V��M@���"�tt%�%�r�F5-M�jT"��'�~%0�q֕�+���k$,������!Y�3�=iW��PW%���	"��HJ)cС��U��K�J4蜛�?�2�\I�f��|�68��Sh���U�z��kǃkIĹ&Y
X��@�J2��_�lLH�b2�j��&��[wJ��	}:����>8e�<���ǘ�k�i�9M'�A��-"�bN��|���nt'D�T��u�h�̄��Ă�ܭ�3�&���EH�b� ��{ᘅ�(}{��{��'"e������$�Nr���e~�Hy��)�u�ҌJi�)-W�J_$%"��N�9BS����j&c����=i��Ѿr�Y��/�,zq����������d1X�3�%VL�4����.r�o�ڥ��{Phf5�wV|LP�V�'���xn�䰢�U\k���f\��Dk�O1r��OA�Ty�B_w�X�A��l�t0�d̃ش�ˊ���,y�6vL_��h�]#2X��Ũ336S��H`'�鋓�v6��@x����+e����ԇ=ͳ����.���H!���n[ ����Q@L�FԘz5A&i����N�����[�C�$�:�������Y$���#kY�T���Z���|B��ET�.I���
%J�<�r]J�v�2�Աa�[�4�V��8	lJj�ʚtH���a��/��o��(
���P�+o���;#�	ns���0��ΈT05g������kN���N_��{mNJj��RvS���SA{j���<���!�d�f���F�B8� �IhV�Q9�ƫ�Ky=�3nD��E��ό�.r�sr4�t?�<�مЖ���xM�
�,oY�!� j}���E��f�Ƙ�4eM��(��ޙ0h����N��dEB��K�-Dm�h�xӷ�y�,-2�H�&^M��c��l�-
�W��Tc?,hI!��rZF���)�����ȑ+R�8��QW�ƚz9ʽJb���0<�eBe�7_�?��J����l�xֺ\i��5|�U�<ҏ�͸pD$Bis���t
9�n�L��E�q�YNlOs���J�X@��RTE�j���Zs)9�De>6��D'_$��F�i,�_y;���Ad�h3����	��
e���NT �	���D�P�Zb�
/�I�T�}�K�d��j���))9�qr��?5y�ss�Բ��Wo+%p�	�[�ϼ֎��L������Sd/��M�G��ԓ�^`ɮ�f)���o���>[DΖŤ
	,��*�)~e���i$��P�V�l
��5�h�vS�;[k¿	,lK>��Lպ4���=�J�Y8�A`���Su��V-uqa曞�+b�rKM	�E����57�qJ*+F��@ڝ6�%������1B�����D�Ծ�d�ʎ��	��t͜�,7�D���j�	<����E��������jA����J�g3%��$��>V�No�������9�    ^O�"Ϋ��`.79�@�4ԝE�)ն���j
7=@�c�N�*5��%�~>k \˝��)��#�T��DWT?�R([������$�,�2y�佩XɱKc'���q�A�.����B�t�%FыB��)�%�'^=X,����؀!4�0r��΢�f�_��6������o�(��,!�H��9P�ӳjs"��2/
����*��bEA�]�����#˴�^����),�h�gZ�R7��$��e�gp�����*r�W@E�c˕Q���vp;�Y�#������N�AJeUcdZH*- Ԕ؊�^^��Jr�=�	�_q=����q4�3�[���~0m�y����\��
��3�[�bP��kh�}�d��n�0�5�`^:�7�͋�F:�E��?��t�ŋw�&o�"#3�Pג�H��%��9�u(ng�����v�),�XK>k��䙱gk3��48��_��mXq����AAرI&�w�[x��ԛ���]��E�i&���(�-�0J��f���#����k���a/�S9LSI�b��8�8��������4�>˚d�a:�B��#��h�0|��x����?��]k<�uB�����	+-Ԇx��X���뻭`�\�
�a���R�Q�)�\�*3�3q}H��q�P[��_�>�;�t� `�l��N��\b���%�OK�Ä�5�FX��t�J
:q�m2�sa�6:��B�0���|?{9#���KY��at �кX�y���Q<�k��W��d[�@z ßm ����K-_�����f�~�h�o!��*���-���I،��$Կ�`I�i��D�������&��ۨW��|l;1�n���V#2Jm�����xPE���:��Nzݼ]�7�~���7|%:C���3�O ����?�g4��B�JSR��*X�F<�K���\��
N?4�e�WSO�������̓��k9ŉ���R�0''G0ABBDI�|�B׮�v�ӓ �n(�(O�Uf�����H�<�0��r:# _��(����Vb�k=�?>�}8w.
3>A1��<�u�Y���q��܆������]��ص���NC�Ҕ�p��V�)���)hZs�ٸ����ҁ��⨶+���������u�%	\d<��i"�:��
̹f���X�F ͫ�WE���C�P��j%x�"ϕ�d��
hY�m\�q��u�@f�B��("�n�4���*�/������r����n�2�����^[�~o�����lb�g�Z�|������,�鯑�OG�<��t*SA]s�����>���g�����{�Xy���S|�s��?��N\>�I�>����`�?�h��⇟�+��ȗ��������>~�GG_���	~�g����/����������G����<��O.���S��?8}0䋿?=�4h����}�O��|�x��-�FM5�Q��%c��;+����_��_A��WQ��� v�~Ef&&��7��x����'m�{�TW~r��f���+l}h2���fx�P�r�����2��$;��ҹ��C�S�0�T@Uᆞ�{� ��PԴ��'u��f\��]�;���/8DASǗ��XXv���caC�T�ʒ�{��8u7:���������������8�rP�F��z��:9�����_M�QOh�,���MU ���.�e���f+��rv<l�Y���y���{��z�1B>��r��1)�'*(�j�g5TH��-�z�1Bj�7wS\QޘrK؝E�ݮ��k^�-�\nI��E��2�Կ�*a�՘��}k�gxY�}�J��X���w3K�
�n��N�b���M�vk�\�v&�*�����V���UcTl�e���n�������.���lՎ�A|ɠ�m�s�b�o�J��R��%<�О�
W���C5Ŵ�Z�yFӑF���y���`^\]䝧m?qǽ���c����'`��D�.J��ɺh�w>�������h�r�o���n'E8-��vΤ
��	���̲v����r����P-�o�
�Fc�݊���{�1KGlI�2���v�@pBqk�H�B�	*7A�Z�Aә�WQ�,U���u�#]4D�b�����"ώP��Κk!�q����O�	ӽN*R��jܙ�unRUlҞ�d\��~p��,�μqZ�ybv?�'���0R	��);�uU��1�	��Ly[e�k���-/���(�q��D/�t�^��L��������Q" �9�u��Tk�� ֺZP� MZ�iL;b��Z�O��{:�.�tle��dy�a6�9�o�����ܙ�ACc�ѪZ�.x��y� ݖXB�-��,٣��r������K�:��Ώ6.Oo4n#�a�Q��>d+g ��HjI9<��l]_�De0KU<̢�n^x\��ӯ����kp+k��3��T�k�h#�o��Q��"+��4�Xxu��{C=�A�]I%w�Ţ����,��KJ=�+K��耕�� ��X*��̩?�D�,�&��[�z�Hz,��k�� RW��U�b�*H��V���m��
�iy߹���ޝ_����[�����������>�s�'Ý��?� ?y��������\���;�7��������y�j ���|��"�%"����������o}I���u�����R7��`R��SEY~��4/6)����M:���8>,���=����-3<}<�}��ŧ�S�	1�{�7�Z�rKR�sϒ����1�=yU��y�8��T���,i�����th�y�Z�6!9E�h����%5�m�
F� >�t�������������d���_秥���z`�Eon�[zl�`��u��sc�	QG:E�2�ܢh�V���`�!(���k����^��jCVo����M����0�hLy7G�"��ͮ@�dp�[�3�@׺���dw�E:Ud�}h���8�?B�0�*��S����LeB��F�~e�;���O�>8{T��������}�ǗϞ�z�Y���.l�R橺�Tl����`�
ҡۮ@���th�CaECp4'�h>��_��^� ����@���K�l�hDX�����*�>����#�V�'�VVXX�˦V�t��k�_d;I��7� .u����?~����_����c��g��r���ŏO� �A��V�J��9zg�Y��j�L�B�7��˖����'^K3�>�K���{9��@��5"�}�v���oM^��*Vf4�7T��*�a-��4F�=|Di��Ј>�K6tWg`R�V�gn��c|��(�b�/��C�փax�$�9]"G}���쌈����>�N��,�o���h'�HjM4��
��vi�R���z \Ŝ�G�}9���>�����'�z������������[y�B�H�W/~|�I�9�ǧ���O����O�]>����9���h0�e��)S�$_�]�5�3|\�*?#5������X��G	x���^C�������y�9X�R��ڠo�H��7aS��l�Kp��5����(�ϛ�b��53�S�W�����/i��[�K���+�t��#�8��2lj�ݷ�3��j����H�)Djom���rV�y�Lx���6����-t��X�8��h��@�y�׃�H��
]�-p�����̛
#9q'e3<x 7��t	NЀea�� ;�(��F���f�b%��7��n?�Fg�2�
,�-]��+�(��C�9�l�X-��Π�1I�T8V��+ج{��F7�˕����վ|Q�����M�t�[����Z�X<U�uM�I$���m\w��\��#��@S�8�� �P '�Q4�Rͭh�����v��#���v��r~�jx�����x��J�m������D�w~U�
���n��u$=�M�|�`�WhB�e��OoySMh�����D��5p��
�T�T��T�F&rң@z��M5a��s�:�@!���n��t�ʔC���M��O4�L��ɓY�9�C������H]T��km�Z�    U�en>�QѬ^�o}5��+C���xv`
w��%=Y�)p,j�LɳD|2��+�.�$O���w��n>wV,>�����%�Ӕ�������.n1�+*�"�~\�*�#5E�ż��Q�fN�
lM��S�@�=X%$�VJ�h���?@+�{�-� �]�
��c=0j�fQ��S�M%q[���Z� ���9���o���¥�
�G���ѩ#-��}E�.�\��bb����*~�޿�����p-���� Ƀ��k�kص���[ۘ��WR�/<��;�φ�{�P�un���TS$Q@x���}M@�P�� $S��N+UEَ~^����/�!������kZ�����i��\���.���2֢ܺ�e�������}�;���ý�\>���C�?~���߻;��/_>�˻�~a�{��([������ֆ�����˂P]t�T,L,8��͇J�*rA��(-V�~?-�`�	�ƒI� d�i����%t�������KhP	~}��J��u� ��*ט�5�#d8v,�cZ��M]Bd5�¢��Vd��҈=/�==#Dh�J�7�;!ž���zlb:�K�N�HŲ��N�dzL�ڂ�(	Ck*7�g�[�����UE��� ���'A��9h�� �_��yTtQ�
���l�����}r�y:|��)އ��������Ͻd���o��[�/��챞dݿ�O�f0���a�$���q2\]�(6�*Y��HGὠ����&�k�=fs�d��Ա�%���Ʋ�%�f��&�.��|e��;E^#^t���^�9@�ld�[ڮ%eɜ�c=� ��U��#'[]ןC��N=�!�b��^T��u����_k��h����.��w�|.��X�㋿�o>�ӓ�??:�����E7�
5Q�Kd��5��xR��kz�i�@\j��h>`�ҟ�'��rJ�`��l�:u��Yɕ�vu�����:�߆ȠS���XI�W�/@�QW`k�j�ȩ|��1v���|&`~��s:R�G��������o�g�	 ��x\�;g�j��;�}�}~���B<����W
�.�}xvYI�Md5JNW+��4a��c���ڼ�}��E�~���t�"d�۩�3���L��~�]t41�15�ܿ>'q���p�k�����;�.���O(��E8N?{k�����>�󝛄��vi*��-U�ϗ�V�Z>�M�3��r$��\Aܣ���!o]�;+H[G����Zamd�a��_F#k�C�j�tkP���ϝ�,%+}���Y�3%8]�i��F�$z���Hw����Q^��y�'/����N�����V����ْN#xP�9|���b�M$#d,9��l A�L���/�:�g��56ki�-�KȔ���5���!u�CL�|q�18�xp|��^�?6YC�����2�.��2v�`E�C�z�#\?c�՚M�1�E>�\�:ݩ#ʬ=����޹s��χ�_��ݮ���ަQ��{�����ӿ�|��������O0|�h������=���݋�¯���_{o�7��<�KA��>Y�g���4>�d���]��Z�ط'o�<�����=<������O���,�;�nɗ�� ��ދ&�ۇ��28����6��-�!q�J�z&�kߊ˔����0�6�Y�)�ŝn�b&����\�/����q���y~��JS2��@�`DM7O�X��f#�b�=4�~��:!�cv^�|=3��HMؤ����~������k���UOMd�9P�i6�ɝ�n`�TV�r3�ۖl�f�h�]�eߚ�������[$})�����p��x��͠	��}�l���������+ux��OO���H�SkJ_��5�A#0��ba��t��J���9�Z���3%���q�wt�;�B/��_�q�zl7�������/}��it��Q
v>KM)5]^�-��h���%c DB�����ONԗ 	�Xȕ�È�S���C�M����7�џw�uJ+�:.dSK�T�������x��Ԅ~��_��CRG���K^塺�t�Doz@pC�,�,����p��]@°�Y\�O)�="��7�S���Ee����WF���ɕ�g�I���` ��fc�T����w�R�B��$�丠t<�[�k�N����V�m�oa����gQ�#�cd���vSjЁUQ�76	�f\<
GL�6퉘�ӀA��� N��i��U���ٲ?B�::/�pѳ1�u�ʋcJ\qL1��}K����SJ�-�[�<$��%+6��j�
KT�Pf9C�z0��K;/2&Y	�~s�%�w�	�1V �
=0��|-"K˫��*�˜�+��.�J�?H���������xĕ���im��Ot�8$p�Z-����>��R*�']f/��k��;)��)��E`�:lt�<(�d�zyՠ��Wb���@F���V�0�1��SdcnF���L�E�׷��
���'�/��.�'A�38hV �:�Ws��L��#�1_�S"FC�f��Z�бD�bW�cM%�R�@�C���QkVt��E#��ۛ�����шg�M��X*��c�z:wF�Q�wJ6¶�`��������;}I:|I��4]��Z�+��>)f����ʝ�G�q)�,KzbB1�y�9=�d�)W�����~a��#��+����{�_���r����Q�΃iXN
֊� ԗk�����cC�z �˒�7�%���}���u<��� �nP��Qf���tiQ�N���ˠ�
���~���٫3ڭ�~ 12<Q!]9��2���C	��m�1)F�Z���]��5 � �5W�� o ���Ѱ��ӝ�_F�͑\<T@�������ec'�����.>��k*1���O�U�Z�@.�o��[�o~7��c1�gFK
(A�:AYj��	-�I#���$���W�<��S"��
�6׸%���b��D�oR�"�i�T�j�}�ҵ]�l�^ܮ���|9�M�^:ެ�f�~�0۝q	P/M+J*����f֊(��ʉ�4v;uE[2e礦KpYE��#������j{������(��~�De^��.�z��l���f2����|%)��J��	��`}�47��M�L,�p�Uj��`��r�xO<*�%se/r	��v*u�%�����^�����$v,���g�qޛ
/~0|�����v�	{�m��8�6>�Y彗��N�W�4�=U�`�Nj�E�l�pU#TkIܓy�n�Sɜ�,��"���ѩU�逖��������U!,H�v�2z�7����������u��;��x���3|��_��ý;������wz5r���������y��Ǔ�Ď�'�v4<9��e\�>�����L6�^jt��n�z��{�)��B�f��*��T�����5E'����x���<�_��{������ɉ[ApH��ѱf)�J�>/Zs�� `����W��޻����Iai��p?f%]1 K���� -�K���k���H�c#VC7./����x���)zؙ6������pωVB����_P�c�:����' ���4A�$�t�Cl��������pM6����Տ<�=�&�؀�������cM�,~�|}��`�)ȼ��wN�~2���M�q��[li�����<ܰ��D��;h'�jVl�`B)��P��ذ��T<A�[�~~�S��C�1Y���� ��ct�P(\��/��BF�@s��)���[��X�.F�[u�o�GS�x����	�	�qo�{���k��y��'�'R���E�|��;�]>s��[rx��������C��û��������K£u��&�u�0_�d�'Q�ͼ��%�t}<�%mK돗�����T΁�C�.X�~�0�cp,JY��J7�i?�A�E�G�V���Kb@�L)��䯇4}�4����ʾ�Ud �/Bej�U $�T %4d��@l~���Mg��,&�k����}>K}�?�g���`�p�u��o�|�S�?�U�@�����{�{���{�FJ�߇�,ǎ   u��n�hAc��l�{��y����%kEFbzt��5��Py����	��9�i��U�wzk����\�����5v;�A�>ܞ:��ޏO�O� ��4����*������X����K��085s�L
�*��$f��
Ժ��ǯ�IJ��D�Nʒ���$r�u����@]&��B��p�����\0����#RA��ݹeܗ3OV� ��Q$de0O�ڷ�z��9"d�JY�8đ�ʳ��a!r�,(�	��8ۍo�
;K��g?|����W�����R      A   �  x���M�G��z��8h�5�9K��o썓�m{���aUK�o�*a����: �ހ5���2Xm��}��g�>�ݾ}���A�� ��Mt�=8~�o�#�C�fè������S *��GsE)��B�uz�j��ƴJ��cP-e��!X���NEk��oXIņ��1��j���X������*AX�Y���D3�4�
�P�Av�<ъ[�5v-��2s>�0b�л�X<�N>�'bM�W�Ч!I�.�����~c��=O�諁*��V���Hb�u;���1�}��v7�R���!Q�T�4��U"�Iv��l�1���RǲEf%g�[�EK�V�5j:{�}��2;�ך%GŸ6�Ɂ���$t�^X�:=!I^r���H=�*����ȝ��#��LD��Vk�skD�c�|���B�	 �o�Kj��3���P_Gjc��Q=4#7���IZW+yx�J�Dj8պLXm�fgq�9-�Y(�$�U/.�ş��V���׳����8:�7���gR��J~��>%�mD��'r}h<9�6��rXM�=�4����
��*a��f�_��:y��}����2h*j�{�ml���j�j~.G��%B��W�b4T�s��"������D<	J?�ׁt�ᤧ�f�]瓩�91��ːS�M�T_�{Ϧ���(ˡQ�|��n�5#���z|c�Z�0��t�0�,ז@�ʹ���(s1�΂�͕�v�b���w��ó.N������"Ȳ�'"z�2�A4��:I��z{{�c��      B   j  x���=�#!�c����@?H��l��`�_�`7�����OM�.Σi�XX�[8Xx�����{5�ځ#b���X�~`A�R�ʫ��$:jc�v%�}�;2#%�m�& �e@�Z}����[7�8`�r���9#cq�XSheX�A�>�i*t�	��E빤�}շ�)|�9]I�	�5VV`�恓 ���)risI���b�X�����V1���vn�
��g�S�Т��N�{��j���]YA�ʴ��=o�🋞��1Y�ɯ��9:���}��p^�1�Y���k1b���]���e`��R��o��c9��iiW�M�o2�Mp����G����v���9���Y�%�      C   �  x��S͊�0>'Or�e�cˎ�̭���zZ(����IB���}��K_�ÞJ.����I�L����$@� ��Ё�b�Ug���>e_��4�y)>G���B�C�u�����-��?�MQ*,>�?��G�˛��Ns�-�-��L�_ֹ����4����{�TN����j�:WՔ�W�*���TU#s����a��xD��2�E�����tKH	!0G��2X��@
@�����!fOS��p����uZ��a���t��N�:.⠄x?�Ў�wZ*%nvAQI�i��;�ze�>��;g-%��ݭ�Bz�.z�
t@�L�����2F��w܁��Sv5�#iMd'9���_(���7?WE��8�w�y���ܪ�      D   B   x��I�K��%\��%�9���+#��8�B�p姥e&�rB��ĂĢ��ԼN��+F��� ���      P   �   x���;1Eњ��(O���q��/@��t��:&����)��X$˧�hKF����ɮ���'Δ�M?z��Va��ld�ƭ�p��^:7��3P�T���
��mR7z��h�\T�h�w�A��
�u���^:7�����p�`      E      x��ks�u.��}t*�v<=�w�@�7�6���(	����X=�=�1�3 �S���$�o�d�I�K$�G�o�_�<>�
T��?���'�붻{@Pn��o�l�3ӷݷ���ֳ�ճA�[�QaK?��ӠL��͊�lhz�%�hm�(��8��P���ӥ�u�奎z��f降�l'۝���>��N��bi����q���
��W6�����
:֛�z˛���-�7��W��ܕ��KW�?�E�ݣ�_����y28|śl��?��>7�:�^>�â|pt�u��m�n���Z�͎n���֋�n�~~♎ݦ5߄5'o�����r�۰O���Rd����еl���O��Ou�����lw�Ϛ���'yY���%�x!f�E_)_E^�h�bӮ�6�"\�,�� Y�j%P�@EI~��߃�lgoeyyg����ݝ�t6�[��/� ���lRL���6�Vk*�D���Q�r�(u�5c����Lu�>��r�����b8�v��t�\����z��[��ty�3�f����{˶(�,ȵfY�U�Y�G~�=e� �ey�~���f���E��e)m�'Eh�~/�F� SY�3K}x�z�i���C��!xZ���t�*��߇{���NJ�m�;/��\����4~�ި���|�*`T�u��d>�:�_�M��r������G��1hC���N���nyuo����C�xgv��[�,��N�c\h��^6ʧ����p��g��7�Lwg�hTne���4�#�{��g�����t�j^�Ά�a���=�fo0�v��a���^�xu��	�g�$�]Qz�;��+�5�C �gp��ή��YgW"���x�;���l�H��A'�!�&�}���a���2�����w�q��F	����l��l�5�ήX���O�~��'��`��j:�h�|��R8�� 6W8��|
�\�
<��}����jG� g�gW�ם�2���}�_q�3<�v&	Rc����a�V���$�3?��X��̊�]RY��8�~�U懽��{e/���K	�cP�x3��^��[~
�?:����i��?��
���F%]�Xt����&��_�[��h��R&��vk�(li}�(�[��8m�%�D�?�~mX�̓�"��M�諦��n�]������%�צ2��hT�OU�j���F�܅��'���b���;2]X6Ά��`����/Z��|4b�ק���0�]��U�9�����{�y�3x���{�����l��,O���~��}?�E��%I�/l��Y�F�����W������ʂŝy�6=�MT:��x?�Y%��8�[y�F>��������u\�e4�G�^�x=����jgi֝İ7��N:Z��؂K�;���W�^�����q�c������c>`�me�������27��7���EN�{}��`�CS1�&�����Nott�%�@�z&ã,>Fƫ��G�~ټ.���w��֯�������.��ձ��Ξ.�>���0���q�g�0
��s���e��p�~�#Ǹ�{��Oa�ـ��=zcx��������ʤ�g���]}	��gtNy�[���6�s���R(��z9&��o9�֯w���?�]����ՙ&�g
����J���jz���a�bL���Q�tgA���ڰ���M�rzh��+O�X?p��);S�$�U�����$�B.
�|A�&T<�P�=��ҵN��z�,z��t�( _
�'���'; ��4�g�DjM|-��|.��Ȇⴋl�ε��cy��p��0N�=g�9DY�t4��w������Gc�:����������Nhሸ�>\b�}+�A��ډR��0���5�s�q,:~��L��q�J��u"̈p��%\��>�$�0�pq���M'��#t�p2�Z'��;�;���QG���xƘl;�"$�A�@[��̄k�T1��f�3l3����)�
��=!
��/�..��D��� ����!���F1쀁
\Ą?��b����	�s�� ��O��>6�q?x���,%u cu��,������\�]D�>2V����.a�4X;$���X� �^����Ӻ��~T�L�̋Ԝ.�xX���&�&�����U��Yo�5LN�zB����n�H��}8X��VlMm��߆i���6�I�5M��>��w�ڇ?���Ypl�B�q��,�� ����i�E��(�6��~�/D:�6/<y�E��ѭ��֎n�x��{W.��]8���Xr�ˏx�=���#ޅ�/o\�.>�{tu����ڼG����k+��@u� PARYxm� �{B>aOa�U�2<iu۠c�:<im[�'aK�Z�iX�Y�$V?�3zr$]�oPe����T&^��2-E6����6�m�S�3+#P��+�M��ϟ��t9KK3���ij��6�*]0�a=�!�'VW-3O���ӜM���V�M����;d�9�f�=�h��58�4MsT�f[�f��4k7W�4������)�)6kg�2�[�~Q	<Wy�U�AOr�m��H���rT!l��_û�8[�������������zO����y0�O��罍�O>}t��7�ͷ���?rt�Ս�w^��׼��d���y�S�v��^�a3�!�� ����ޛ�~q&�F�}V���������W��<3y���{�
��xp�n����c�%ݺ9gr��'�֭�v���c?����w�qt��!=o�6[�o�^�M;�6���0J����od����o��!FB�X�a������[$pJ�[t0F�%8�����Џ���~>Y�=9��O���+ޟ���㥠��'�n�z�}�F�c�е��'�IӋ+^`B�޸�}��	�sGa��b��**�ׄ��;���	av�5�Lr���Z�U�ґ�@�FA�IE�ؖL)pNt����ݫ;p����I�p���Q��Z�Q���ҽlo�?�e�V�d�a�>hp�wiZ!Ox,%�b�%��G�lE�8�!�FBKM@ڵ�f(2EqK1(��OQ�(%�PP���G4�H�XL�Ë(B�S�	��(dd9\�U֚ F(�J	y�	Yqr)��Ø�F�*���t��XC;���1��e@����a�a� �)�G�*�@|��逻�pR�ڛc��ҌGF��2UPGs�fJ<�s���١Gn����]p6�c3tb�-:Q�v&,˾J㧦�0�!x���-�T�.��c)<Ha=Ha�������
"?�H���i)]����Sv#`i���,��0�:�.1�
�ν(w��r�|mǇ_f Z��-WvY���]�����F�hd���٪���,���_wG�MZw��7��f[�򤼶�9�nܭJ�#Q�����;��������86,��
����~��`���a9�_�~���w���r�&���ޏӉl�������ߖk
�<�E��0�R=?�u�'I�O�"J�ѧ�	W�fa�F�z����cO�����l���s���#އ�.���9z?�,_��ˌ�r`��=��<�cP�IB3� `yu��cx���y�k��?�5؅���!G8;��uX ������B�4��&޲wn�i;�ϟx]8�����x>��
f��dT�]<��Ia�����O�ˇ7�K�٠C8e�fg���!��+�����d����l���!��g&�n�j� ��M<��[oL��v� .�͡7>�1� PyqHy�^W���x�q6ψ��&"��+�G�����,�|	�;��}��n���:a��`ajx
o����td�E���<�u��r�p�K�7��j%�P0���P���6O^l�b84:�gi!�7��.�n]`�\/���>?p9�Չ7�gg���<�=�h]@x�n�e�X��:���B_޾6�6�j�6���<�
|���[?���!]�x׆���o��8��w'^u�0��g��uW8Q�L.����h1���[��_��S�!�M��pқ^�KQ�`��3    �}�}(o�/>�܇����ß�w����)�Y6q4���2�xO�v�r������1U�(��Z۵Q��F�?!�s �� Yu
�s�����-A�-NLS�QQ��k]�υ����:�
���~Wp���N�z�b���2� �7�xʎT���g�S@�x�9�zs�z0� � �!��Q��C� d��u��ۡ��E8��2�-U��@�m���!�	D�u �4�7���oN�E'E�;���������UZ�S�Hw(��b�,�B�;�)!/�%m� Aq���F���M8�$'���(�R8$�A%«J�9���P��x?;tXL��{r0=v�3����u���1'_3b.a@�G	�0����8 5��_��$�< �
��@� 7L�
r�#����5�%��]RRB3�ϔ���f�I�c��P�>⺀�:iD8tH���Rښ��h�9P;���@��;��;��ǘ�4�(��A/��!�T�#٨��N�L5�)�5���Vh~�0h�hN0��IG��8�R�&9EѰ��V>Jp����R�3LP���H��YD�*��^��]�o�R�n��dޣ9�kS���l80J��qF�36�����%�2��FѴ@]o��	L;`�"%�8`��7� o��ϊC�M 88�I���W��<_�s0����iz�r�!�*��"�ǊOm�O��C���\���?l�/�� ;$K�?ǛG�DxB47�w_k-H_!���m`�ҷa`����������뫴���9��3����&���o �9id|; H�{F����� `2 0�JWoms�t�ٮ7i$�N���F�qaǀ�^r��;4}�yT�!��a��[/\`z	�ye��.�5��M� m�1^�e{G�~�H�(/�w�yN��@��OO���G���1rh��r�lB
�r0�	8��O����W��B��ǲ�w��qb1��E3Gp*��9:�f)�-��`w}�g#��Ո6�^ƜY�´�ӫt]�;��)��I"v����>ϓ0��[t?ܥT#��6���c� #�8����q�&<	@&�	R�<F�4l���05ƚ��c��+���V� "�]�օ۟Oww����d�]0�aWsܜ��{�h7&x�����iW*]�;؛���l��~Y �k�<��[���|����?���r��n�n|�q�U�-�Fӭe0�����^��@/Wq��`*�!`��X8TY���;`�Yot�3sb~�A��ُ�Ս"=�?1���=��>~�������Jl�O�6F����W�Q:������������������D
|��c*	|�SM>
Ǹ�T��2�/T#5H�'�?#Kl8"H�2�X�ێ�;A|��)J�oF@�'���,F���\�C��ޔ�O�<CoF�<�����#�sV��-��>y��|nT�$	�A� ��D��5�
M�Wc|��}�h�8�E��oBh�#��\��\8B����"��� bn�!9�8��1û9AZ�a�$xȩ[���4Es;Q��$�5ϼ����1b�n�Jt4Q@�>�������Q��	!F�j4D�o,QkA?a*�9���8%gB9f-0�Q��S2[� B/�Ɯ�"�x&��%�!]�§�N��#>�8�J�IF"�q@�P�ߙ~����~)� a�i�~nk��o�}�7�ޢF O��E��#_�,g �xn���-�8cp?�%L���4��_X�v;��.Ut��T�S�hJ�}��xL����X��I�#�("��rP*�$��F8m��c��KC���*x���%��:�c�왉�m֩��Ʊ0]�֋�o�����g+g�tu�A�pk���#ҡ0��'>ofW1
0�M�$�t�2Ӹ�����qM0�4�܄c���,,@з�7�����ʤJǂm�3<<S��rd��g�"��1n���Y��|F9n�Fd{mV��O{�����o�:�B�[/f � Im��3��?�|Oi�@�?�p�£G�~�����W+H��^Lҹr��Ǔ�->�ȺWQeX�(Zy�Δ���B��6Ơ�d�F`��F|!�.ñ���i���8�/8K�:�\t��Qm&���Y�S)�Sb�.��Ozm��E��2-CkI`Z���-Q7Qm[�55Jr��k&��c���+��*W<�s�e��!�h4�n�C��b���
�$g�z�J	��{<9��7�����~u���N�ZL��1���#��/��ey׬p%��R�B���W�H�w p8��/%"����X2��p����I_�ǔ�t�*��+��w��$1���#���ф�T� �6������(jE���C}!�I�DȆ1�F�[�0"�i]2U��B�a�8�E�g��NP�9���	�K��=v�r�����+fB.�8��W�GH���´ b�21�$e�)�	_\\�b_5B��d5��8����.�PH�=�0�L�w��Lh#4x��Rth���Q^{��h�*�%�9��E9��QDfaS41 6��c�J	]�&�h���C��)�3�"�Q�p�Y�yG��d�W��!az��������� @7%�'�0�㎋k�p���C��!�3g<��D���ֳ���9>H7��9��B�3��%T�Y�.�7ؕ��0�-a�:7O�A�w\
���LD`�O�Z�ܽR�wf��i�D>�%u`n��|FW�9����͉i��5	��N������C�3�дdv��z�)8<�,�	m󳇣��UAnfhJ�$kgr��E~d4����IZ~�$A�3�̃�x�X�o���G�b@��[K����F�6�;J:*_��2TRw�$�TR��iOEXpd�n������<e�
HX�Ǥ6l+�ԲHUk�����l�x��ȋυ0�
���5d��E���VkzvWC�����SX��(aH�:W���$HK�&�����ږ�q$;	��-�-s8 �
Z�%�t�����D$�gl/g�~�,�&��&��:(�8�6н���}%���ڇ&����*�U�i*&Ti�|Յ�CMKLZ�FI���O��zi�j��FQҶtfj-��u�r�*5���/���7���� ��8�^^?��EG�ef�~ώ~���8�����&q��g��$��V�KomC�K�H��u�����n������s���a��k((��ǳj6]V����\��
R����+�&6lL�{�̛�,f$i	�Q�>����	D��skF9��%�(��|:��!���0����BXj����}qVqr�S<�f�okXqOh�a�7�x��Û4<ə�b�cp�T� �61���&�(1��o7���F������ꉼG	�5�?�d7�Z�Sv0���quHUwU�y3x�����	?HH�|S�#�L"1��}��&|>t׽e�}�/Ka�#�;��	>$>)ۘ��lD/z!�0�FႦ,B���u�0�)k)8�����V�n���&m�P�둘 ��Q'�u
��$3�D]B�t�ِ����S=��ĳGE�ġ���8%�8��p��q����4쌘�C�o�$��wU�����}QX�C	�2�dpx�0\��q���A�N"�:�8�OBy�4���|�>n/|0�p!$�&@7K�	$�!o(��y��.5��<$�3���ְA���B�p$�t��xVN��s5L�q�=L&���3�Ip�1�(>D�^���DI����@�'���c5#�ի��ec�0������0��0QK1=��VA�O��q$bC�z�*`C�B�FW���I=�y�����v�ʭ:�W� !�K���\==_D.����y^~��b7����$L�:p�=bSq��@"S.�Ɂ��H5t��%�;�coqXs��A\�*�� ��T�2�(�|G�����)ʂ�y�4"��"��W�J��^P��RpAR-�,J�>�S�J��	{~h���ʢ 8    �8��1E�:�Ee�"�ӜJ҈��ǵ��
Z��,b���e���ۡ��%��N���n2��ֿ�e'��{��d�PRل*�L~�/7��h�_J֑�F������4M�ty�{���k0�)Ӌ�I�G�k�����o��T ��À�\W�����0�H;C�Ô.U�:�<&�4/R}��P� ��掫� X{t��m�.��Q}RߚKP�/w�r;�h�r;>��y������z�z�Qo���ӿ��?�������\�5�<�'��u�˗ 1�e�� ./R�{�~~>��%��!A踆�9ǪD:�^�ҢU��� �w~:*���^��8���?�(ר��v-u�XP�3`!�svCx��)&�Z�m�Ҷ:oI�V��ض�Fk��`�D�@�Ä�o%���㭈���A��c=RU�g׈Xl3M�e��??N�*n (�L	���D�8k���|.�xBQ�u(�='�'�r���O�?�#ă*J5.��p�'�ƲUv�X�������S���x�)J�12��a[�z�:�XhRBrٯ�!��u���"��D eѨ ��~~[r8H�JO��A)Ua(֐�\eRG��1V�����qdJc}@��	C_$��WX��Y�yiN��:�H1��Zch��$vt�� Ą�9eV
'K�gȽb�W�璈r�����HeK���܁sFPFd)�$��jI&L��$ka�� S̄�Cm1~��b����Ú�.�7dp�i���Kq1/lZ	w�p����'X�	��G�N�	�͸ZD^)g��tB�R�2Lk0ף�+<§��b�h����H}]�B��O{y�T�i���{��TE��H�/0,p`�h��F}�،�����pv���'d1r�w���+|��[�U_�~)oF�"@O�5�b���ۯ�B���Ϲ�u�cr����I�I�9.">Y���ҟX�s��r�'���Tǲ`tXEz�>�`<
�bq�����2tޠ�$�q}�����=���pE��� 2C0�<� ���BX���4�e����id[��P��ۈ�=#
nu��O9Z��1���NL������#P�0��Gup��!���<�aIR�KԞ��1��;E���]���$���n��g�`v���
)i�=�A]�$
�(�!ͪZ.jJ��$Q��|�� �>�X9�k:�~P��6A/
���E;Ϳ{��Qa�����Y�g��ga�Q?Q}s�i�O�	��0����~��SD�)�4hH(��aQ�" ًP1���L����NL��} 쫢,��ڻ����Υ_�85�I�iy�ҎQ^��*C?��	.R�=k?�A��~�̱�azQx�<tw�0����U�^�����$Yur�0Q�7��d���^���lo�n�$�S��k��Xt7C�7,@�a=b�4 ׌qG
�i���g�R���d��B�G�Ɯ%=H�L�_\���M�?�������K�3!��Re�5!��p�	�N���W�J�D*\9
I�x�l�ԅ0���H"h��<�`)����\g��6�IE�oB Jh=�q�
+6�jؚ?�V��Ḧ́�B?+�&[� �J9�8�Bߨ21!w����%H<�r~��F�B?iC'�I@j\JYt\�
���"�Fd �����vh�ȧIEi�L_��̧�#�/�H-�4�E�h�0#�����«�^��a7�F�	
N��<�L��� �ИAE�T"{��W9�-@�{R���W20��)�L�r�����:�_�����&���)�t�D6R)x;��#�����Ga��Cc�<�[�TO@��n��&�L��>��R(jS]�\8���eo��ޅG�nv@�e���y/M��ǱB���A���.�޹�u\���q<'�L'Wi���������w<�h�ZNq�E�N�b�ATX�Bdw%�8[�w��'<��"�U�*ɂb6�{BP�<�l6`���?�Y�E��.�Jx~�����F��Em�,I��r�c�t��m���ܼ̕����*%\nǸ�b�Cel~��c��V�|�V��Iµ�_8)x	��7w��"m2�*���w��{f"�U��x��C)�@E�E��T��յu��]A7�wp7fO�}��YJ� 8	�Ƙ�DIn۵��u\-2�^��}�� ��Ĕ�߷%@�0�W�AOA����@e�$�B��5�0)K�5�Eb�"�Ag�}@�i�a�gI�&̗�ADR�I?+�LUx��d�İOɪ_~�L�^@�ê>�j�F�C_��J�߄�����f1��1��z s��C,(>i��%�VM�Sx�lI�W삝IU�i�:�����k".�q,'���øh��:�DЄ�q�&�P��_R,aKʿ���a%��tL�_w�����Y>H�`R�uya��E�8�V)��͆����P��/D''
����U�2�p� �E	�fJ�c������HK�a�:m��2��i�f�BR�a.�KJ>�y�̈́��'N�N��h�q�Aƹ�H�I܃���N�!��VĘ_r=AE���֤�Ԩ
�Q̚���gT�� #�	�U�F�D��W������D��hp�ͬ-��iW����X�6�@�5�KO���5����l,����Z��%lG�"��`b����f�~dir9 �"��\c/��$V�29[c/L�%X��M#x�o`�"𴕔���g�И�0g�"����O.���W_y���c����$�f�?^˪��6�a�o�s�[��EzYEk�/a$e�ְ5%�M�$���x�y1��k��,�_�� ����
��K~����|����O�r�+8��kW���w@��<lQr���?l� ���=������OaJe;޹��_�p*���I+�𹧟i�$���dE�bQ�Ω�}�gXΉ����+cx9�o��ƭ���ڰ!�A�]���v���|�+��[/��e���=�}m.@xv@	y.�v D�n�+V�
/y"��Kz(�2��.¯Y5�Hy?r���]�R��/��w�s���#��G���	<��Ù|b]���R�VO�Z�?���8�o���Pӌ{a};+�J���#ש���g�һ��nw� ����_zPS�C��M<����bKt���_	A�$]���/U�G��:��h	�~��@R��;{SP;�����udx���O~�� �v��</�ᬧOA�A�>�}�$F�`�ؽl�d��A~oj(�ѱ�_�m���p�zA)f���0kª�-��G����#\f:�D�i�t��� W�8�p�'�Ҍ��^�>䘤��fvD�3=D\��_c?#�z��m^�lQ[��_�9�gA�l��Gx����m��o�]D�F��|f"ͨݮ�-�翇���5����� ��m0 X���uoT�;��(=��P)�|NgQ�T�/��|��D��E=� %=��J�x��67� \�>*�udNQ��$M��mI�06jIF���͠���|c~ ��M�k�q���u4%��0�N�-h�Mք�)�(����U�DXRV�3�����k1\=jĺp�JǼ���*a��Q���$�r�`<M,U"�RUc��0*���C�lw�k��i��0�W%������t3�i���ȡ��IIP[Dr�z�\������.v�:)1����D[b�x������F����Rn�Д���:��_V��y2I�2�e�G%��`PBh�vx���1;���hv��n"�H:���.��5�)���v�E:lSW����%���L�ؕ�#�F%�!��*����scH�5&�b�D�iE�٢R_�|r�C����%���Lѝd� 7ų�GSW	�K[4kXu�c��
yjJ�kPȴ��@Ô���Lf�<?�S1��8.
S�#:s*o�Y=%\��S7�M鵠�,�~����ׁ���%I/�[���.�K³O��J#�/�g�9c��D�hߘ�s����@<M3�:b�����#=�8Ґؤ���ˈR14!�;+"
#'x@"Z�0j���%�ت:�H�5    o>�9j�<�ĕ�9E?�-4���7&Ez��xKB��T��'�ibQLN�NS��CiN���k�M͜�w�n��8�㞊��pj��wyJ�aP��j�lQ�>"C]�+�#�!�aÌ$dn�D³��b9����J$nE�]~Ӊ��O5�]�btm\`	rt`��KZ-h[��ŭ0"Aʞd���M�e�
Q(A��"���NT�z Խ�l�h�/ɜ뱒 Әp�t��u9�D/�JةdE|�P�X2��9�Jh�5f�ׄ���̨�u��k�EwW��{��a�J��Ө�=��ˮ���~��2�P�F�tˍ�eY��}s*G]����K�qń�+���t3)�6��	�P�bJ5�KQkv �.�HBܪ��4�"Z��J�uX ���F�_�D*��H29r�bݹ��u
�����)���h�m�5f�����	�P�y��0Jr?��������<3E�:ȳ(2��4j�i��ڬ!�Ө��㚦�;F�f�W.�_�K��s�4MÌ�uOE�.+L����!ntAzt���i�i�8s�9�T�`�Du�����{`�������U�梻0i;.�%�®˘N�L�Hԭ��3���h�D��5��Y�un5@9C�J���k?��<�~�e�WM�B�MVQ�
>>�:N�:|����l)����&N�E�+��u�'�=o��޵�g����9?4�����E~>"�!��w�����$�z����4H}S죎zA7H�$9�x@��l���-{窶D�؄-�i�����n�k�tB���HwU-���jjץ�n�7n/�u��\��Nwusr]��5�d�@������3b�K''���%�W�k
b��i�f�c8e�u�9�#�Kx�UM X:�5��*?�ŉ�mBs
y�4a�v���G���PU�o%u�GB��4�Ť��V=���d�8��-�*B���-4We���S�a���@<+e�d�k�$rX�Y�U�sk���r�_�1!*�[;	�7��?�e�I;��R2��O��샰;�
2�&�Ե�"Na�����I�M�H'׆��t��ZU���kL���ܞU�u{�J��H�(wE�;WI��]z���\��l)��=)6a~ՠ�

,�Dܠ�����r�1�eM�W-2WNk��Q��&MA|�ݰ��N+� ��^h�;�|�Jv�.G
�� $c�̠�] 	�����y1|�6d��Tf|�oE����$\�+I�E��Xw�:A�����o�>��(��^�˲��
�v�-��m�j��~�O{E����D���&���*��.����`��s}�u���^^�g��Ʌ�=3��jc$�4�c!��c�����ZR.���>\�	-��t�ɇ�d�!��F0۴��U�ТnQ7NC��SHt�\�m�23��g��퓓�2�J�󷷢ϧ�"��o>Fɑ_�f��Qy�D:�>��Ӯq�=�:�H�y��߅�SIv���l(t�\8̤P���&��PXiM�V<)9����Ϻn2g�����F�{�Hm��?��֊A��.�8Y�W}���MQk+�a^��&��U���F����>\��6+�Ot�g�"�s���O3��p���C6��kJ@M����Q�t�W��#u�-�D7����QIm~t�ӏ ^	�.�|�i�Q�N�6ߊ[�ѦiK��j\I���ā�Oa~��3�akZxOw������pJ�B/��MO���uY,%vi]�~-�l>���}.9_�Ԧ�Kuຸk��%�ia�p��jj�A����ʈAb�R1H5�"=�3�2�pc�*�������zI䗡
�0��)���hT�l�w��)'t�v#��0-�_���ݬ���T�h�?m��k�Qk�Hl����4S*��E����,�*8��Y�G~�=�yq��cD�� iil��_D
pziS?)B��{�5
	}Y�3�Z���3=F��
��{9�)����Nt��������,4��r�[;��л�k��C��氯O�|�yc�oP�;���v�����k��]b�~���y�|�/ß�㇯v�/���Ϗ�<���x��n�_�??�u�u�&���fg�������_�?���o�^��������/�#|�W���Ͽx��w�|ˍ�u�l�_ߐ�|������|�05'`��a����?����h������sO�
�Z;B�"���V��7�<��_���#��<��?r#��EV��U8	��?�oXx�����o~������6��>3��stQ>W�&����w�V~��w�sJ��7h͛�;�����]n��j�ƥX�ӡ�q<���6��I�uG�&=Qt/W��E�U���]٨��E��t�oxr�ߔ~���|�)�t�E���=�\���	�O�-�g@-�@_���M����/��^��ԋ��Rta�q���w�kn_��|�s�"-�@���bd� ��-�T�����#�]p� H��.v�5u�7��K擮8�O��JKĮ��Jܺm��4�-�a�r�H��OT3��y��X%�O�*��%'�ZdѽJ�d�o+r**it߰�G�(��Z݅��P�]K�������ݗh:��$��I�E�D�#AFю:'���q롨X�����@!9��1�U��l"'��aM�kfb�N)R	U=�$�S�]@�?�#	�s��+RfneUe1sT�*E�H����!!�D�7�X%u���(�D�Ai\g%(�͌#�V�DR��S��4ʴ	ȍ_
������kJ�L&�\&�P�?�ӭʭ(� U:��#I�!l�L�/WS�vE!DZ
��X!S=�Z�RѪ:V3�uF�� wj]�P��}�@?��R�VD��h:���:�t+g�v́9���ћ�C�1M��WrWM��UQ����kǲ��7�~	}�����sC�F%���`Q����2�x�D)���˛N]�d��8��8N�*uf���~[2O1I����~u0��"J��@��9�
�12�
�Jn���|�MT��n$����>�)�|��,���G��?��`+K���tJ]�)T�"f~��`FS��O�0�KUF�����O�_�x'e��c�L�?*�#zGi�5�`�V���,��P/�$ �,����	1e�gIL�f39�A�q�#Yb��=��|�?�i��7 s�g�Z���"�PTi���p/��%Ϧ�H_(���p�����`�<,��Lut�x���Nن��y[{�}f����W��Or2`���۟��]����Io�ajq��}-q �,�d��n&R���Qc���	!���,�W��xYL].ҕ �j��4��e��eA�P7�8l��۶�H�0�L[BNdZF�R��R&�������đx��*:�8��8wbSV�0�#�`)+8���wH�˶��l�8��-\�<^��:��KnL*P�����d��͝�(2D�Fb���N��th���	՟Jb�O�.(���щ$"5�1�$W���T:�I`aؠ�������\�?6�b97J�Je=3l\��઎��{\ɘN��B���ѩݵ���Nuc�R�$i�
ԅ�EJ\"�"*N��.��c�cZԩ"�J�L�xnX�(w-��J�\�:'o���$j��>&ySQ��o��Lw�B���A�v�D�ID�H�qU�N�Y�]�ց]���u�w>�S��u�j�|��⸘v��Lh�����Ol���E�zi��^��02Y�[�\�R�N%����E�2 �4��s����ň���]�"�lT����q�ҩ��l�\Um�!U�6HG�P��A���EZ���S�E1�^�c�4?��(Hz���ۛ���w��a=��|T�%�2t,�'oy��o}KP-usW~��~lY��	�J��E�zw#GZם�,��
���41�):	����j��'J�2�r��=�m�j`���z@�{oT=R���S���l�0�L��e!2c��~�Qc�B�m�D�<d�Zj�@�����HK�'ׯl!ZƒM �+2��2�\.���ﶃ�lY-�Ƥ2�qeM�@���!�(��N)ݝ2�[����9�h�Δ��I�~^b    Z�%~/sW�uQ�0��,{�����1�a��o�y~=�ݹ�md�*�	��;�o\��/<y�$ճy���/z+�Ey��������y��x�{�J���%��:�D��ԓ�x�)�᝛(}��;�ϪZ6�k��'?v�B(0��a�!l2�;_ �B�;���.��p�C�x2x�sw���x��M�O��.<�z�9��4���aG�x��~������.?�/x������x�~��?�4�z7/J�������7�B���;�*�xQ'uG �+x���O�7lFH�C�n_?����ļ0�%��[(S��ӵ�8���0�'V���x��-~vû�
�S����޹�߄������p=d}X|.\*\����x��>����w��ꝛ���/Ro��_�f���{x3�� �g���)р<<'��z|<�uN��ll����^c�N���3���7�)��B�&����r]�q����5{frn�s�Ç���(�]�WF�� ���1�!���"�c
#��BL<,X:����7/�JW7e#^7'=y�{���*>�˂��j�x���+���=����)-�C��a�O>�*���Fc, ��`�Z���;�w��1�ß�xcx/�����,�\H����{�坍2�n�����m
��㹾J�
�Rt� �����T�� F�p�%�t�3:��!�xW�b��-��J̷~�r�)�k
��M��(��]Y�F�':�]
 �>N4w����a5��b�M��N�����β�^(�����
��z����e��x9*|����e�)�J�l2�K-rc`���Lp�]��A�lҡ�$����H�	�D��8�;��	l�0�8ˊ��w����t����嶤&�k0l��]���b�vC	pw�l�ZY��2�`��ac其^�6�.|X��7D���*o�fY�U>T��}ڇ����U��*��GVB[���LscZ��F�~)
w]��)6�DbJ�3�:�nP���ib����(�v�j�*��v~��i]�[籄�UKR2eW�n��9E$�MJL��?+�9�"�EXM�	�jXŧ��Ն7	�*~6��n�Y�o�bß-a�1a�~���+�@T�v`&��G"[i&Qlb`R<�((E8Y!����<���˔�(�ܣ*�r~�]�$%�Ɠ�p�	�+��T�#*J���&.X�$��Af'e;d��J	�P,�e�KW�K�g�aM���PP�/:(��2I�Uv�t�j�0�@�:Qֳ�X�MhlxLKk��ŕ�ޗ�1u�t��j�"���x��)(13���q��Ž�?:)��#༥�ZҔ���h��J�kH_����R:E�H�֐�-3+�j��lb�I�L���[�59i����PC�g{�d3����4S8�A�xVx��ɳ@0O���CN�$!X:�,���h�<QN�/��Th����LG�Np	�*� 	^���A�g�]U3D
ۚ��u��7���+�P�nG��aՌ!��p'��W�v����]��n3�PցzJ豈���u�����jZ��N	�^��B�OT%G��$��*M�d�^���儑�9yDBQ�ڄ#P�<��o���Z\#�r=�p���.\8p����4��Ɜ)�6�tm!�Qĩb*7�8K�E��4��4ѳB�M�E�j{�M2�xW4H�E����]uIR,�� Jl`Z���l��7"�J*q�[.�W�V����DR�./Lk�gԦ"U��Q�_�(��Vk)R�/!�)k2+z2��I_ʋ�G��L��
EtJvd�H���3v�S�=ErO�$���t\���;��IW��J�*d=+�y��k��=��«N�ʰx�F���&��q�rRU>�5�va��V�]�d��C1���>�����^�헸�{̐�_E�o���k*����F�{pwX�kF*�U����T���\xHI��'�%�;Us�JVte�t*i�:�I�s|�H�Q�#c�H�Ѓ�Jfw��S"j�A�����
U���L2�H�����>��Dśj먻�2ar��f��D�B��B�4!N�$�I*ޡ��J�|�_�tL^��:s��%��;�K�h��PQ�!Hk���?㓜�┓��w�u���J{�l5�� *%��'������QҖl8YZ"frF�S���v�f6
�4��&~���eQϷq؞�罶�?�q������e�'���� �:��(���)�+�q�N�B�c>VE]K'^5	bO�`�V���8����-��a�I`ڪ���2���e4�$L�����?:��^�I���0�E��S�~�K"�O�2��{�Zە,����K�ѧ��ާ?�]��\D��S{#��S��=e{��Om���B�w�`�߷(!���`�Z�]p���*Ӡ#$xG7�Al�iXmya�61	x��+�o���m��4��`q,X�lѺ�SU��x���h��=���"�������բ]�V��vH�l�lmМ�ZS7aR%\Y��9�H/9ݫ�2bgҲg�<�� ̋A�'�8�azSƽ~i�;e��W��u'@�?Κ6�m����b`���"SwTӀ����0�����.�m�#�����NV�m�¨�a~ ��~���>�^����D�Z������0*V�o�|�@tς/��m?��&<e��<���d��-�M���qѽX��}�_Mׄ	�@2*�E0�	��bI�q��2#JӶ����T&	Z�Su�Z<LE�x��	�f�ev�Wк�������U駇�e��D5�:A��O����y�cG>����u�-dY������H�
zI���O#F/B,�D}?�*�e/�}?�)\�Q������U0Pw{%T�$
��!Z�"��<2ih�i)�23�zrǭծ�%��Z��*���>��z�%�v{�+�z���^���b{9����`�l��L��|y�b��֋-�/~���G�����#���lb��oz���~{�ͣ���8ﭭz�o��]�;�!�CO���ޥ�缧�F����x��K�B�B�������M
��n��v+�����΁��&�;�MƩ]7�p��ßr��u�/�������=3���p�7B]r�g]i�)��+4�/��7:|uN= ;���f��0��+]��y��0̦5�uR�s�ֽ�Đ��&�O�-ۧZ�^̆��>��aK����Q�u�h�q
c�7�k�%X��4`�R���c�C��t>!M�#�F��v�s
~)��bu���&v�b�E�5���t�:�å���� �/��30�Z-+��w��D�Oo�����IcksP|d�u?��U��~9~�Ǩ1��?Y���i����zm��</�����=�u4�f0�M2�oUˏ��n'�w���t9���l��)��+��j`�T� T���t��$I����Ц'���1D�<eg�����I�!꽞����TQ�V}!f�s�eAy�h�[��vd�zcq�T�s_@�F�����͎d�]۽U�̠��4�k4�sQ���Ij����Ujr�5�ۃz=�w4U=$Vp�u"��C�f�}9���庺��J"N�aRIc��)�OJ��Q�	��rW���D CZ��	��܉`nUr��������L �N�!�U���
[<$��1!HAd	�t1G�5Hp�V��7�v^ �A�N�S{5�i�<�z��!��rRCJ��a��y(]�v�'�$M���A.i�ŝ4Y�h*��Y#�I�� �)G���E-k����9���n����������Nz�<{~l1��%���^�O����(���}-a�*��������l����6��Ktn�D�����ِ��� ��'��s�j�Kۓ�������8uł�Oh�T�G{��Y���j�q-�H}��¦O�-j��3ܞ�!)�x,��y��P+T�r�#����r�9�8'R�!��VR�M��*��Wn����ZhL��si5~t�{4M    �	���+�4�#�#���֛���߾��eRu�*��qhT�l����M�yP�j�N��>6�>cK3�cXP!�չ���,V�4����g|��Λ���=�;�u�:���02\��)�C���ѭ�]�s<0^��]����`����<�������?)��������n|�zj� u>�l�%��R$���e�C/P�V��� �2FLp�Ѩ����b��� ��h��M�7fS�A��7 !bD�0�h}x�<WN�݃�?���$�n1m�пx���deu�H�盗�V���Om==��tx���c���_f&������5�{v��OV���ap�+�L����G�-ʝ��[ן��P��>�6UQ��ƥ����������ɿ�ϋg�{x���'�2ؽ��_^̮~������+�����6��Y�u}��������M]N����p�^��������|l4\2����iBH��K�F9H��RJ;�x�ԋL�R,g2���ʋ��!��w�<a5QE�?���:��]�C�����5V�BKҖ�bǢ�Cx�a+Jl�˝�Se'����e.b�h\f�LZsUm���E�%�M\��\J	@U�A�m��0p��ž��n1av��Y���*�V����rI 9���K�Hq�*�4+�SM�+��a�:6S_�$q��͊�0A���]p�]@�E�I��ϘpO��Q��#p�!�`�z�B ��!�k�F�D ��Bc�uF�#	��`rb��gR:?���r����	+�V���-���� sR��"�����z��Q�d�w�M-=iLw�[�D[��Ύ�L5Ht�vn�� [�4�`S�H�9FԐfҺ��j�zX����}��dF��Y��d������=3�g���<��+W������lL����2y�Nf�`:��>�Sn͌�p�#qF�RR8��������9��*���G*7~��=?�u�'i�̂(��"^ʋ̄6� ���9@��o�2�y?I�Dk}7�W��A�͏��ET�l��ՉwN`�S�o��U���	�Cn�֋�'R�Z`Ў�#,�a]�V�v����.%؋�Ę�
��bL-�L��(ʂ[��]��8Y�K�t�O����k�:|�wa}6�?�[�~��� �~l<�m��hN{�O~l��G��_]޽����~Ҫ�W�j�uu������qq|�\�T����{k����@m_
���w�ٍ�r|��x�c�����ۏʃ�s�\�8�V�=���ŋ��p��Ҳ��Zz����?@:�F:�r׈��JT�L9�v�.�栁�8� bM�U^I���z/Q,�pV�Kߜ"!���LRB�;�S���(��P��8��-����Jg� RE����l�jy���2�{Q?��<.tq��JU>�W.O��wG=��k�SWt��j�)����)B�S�tж�ֶeD�Z7_0I˼{k�T��[��@k�L�y/+B?+R RyO��\�GnM��'��hO7>ފ��F���ѭo��|��x	�l^�Kn��ңG�^yĻp���E�P:���ƅߏ90�{�_'vg�&*���0��Z h��dc�2���,��A���*m��ĺ%��q[N<"m{��.���ם�j���Ә�u��uJ�uBKêae���EMt�Ӹa��EA��TJ���lY0��p��߶3_���M9���ܬJ�y�Zc��u�*�fk��֍�e����Tj�0i�3if�L�˃^�������'&�0#�����Lޒs�:њ/�����}LO�5H�ȳP&HLR��(dg����Ql�>��N[�^��m���֬��)۶��m=���])jb�~J��,2 �t�IX?+Ua�Ȥ������m/JJ0;6�ðP~�t֏
�^R�,���=&�g�cj�R��]��(�HI�Wc�z���*�Z��?b;s�vnwj��,J_�i/R?�K���s@#����DIZ�J��Ӳ�X<�1��38����.̩�`J�-�CT��S0ߘp�������%��*]7{��Ds ��!`�$���P�/Q�B�����mOv�h:���� &*Q-�y��� �l	!Rն@[��$5�E��^V�g\��M�X��_Q$&r �g7��$��bA�D��s�Ծ"��T�$���H�A�̳jN�`MT���J��L��Bku�1ra�"�{yHA����l������N溺��jS��i5K�ndC�8���P0}I�I�S�QۊKq�Y�Umg3Z��_�U����z0G��=G�M��^��&~��a��Gi`c%V��܉���1�k�&鏭>��A��Ǽ28�����_��pCIl"��w\ӿuM�_��o����ѵ�;l!��q���&𸣯ɟo ��^���r}���Cm��pU���55`�o��#�~��:�䅮�7�V����<���7��d �H�C'"�������ޗРbY�3��vUs\�ǻMzA��ϳ6��� �斨���>��X�<1q3"�V-�_�o�>����:2���8
d1L�}<:[b�^�7�*	���׹�Y-: ��������p���G7���S��&�E��i�[�xvPN)�WDx��z������%��l7���/o:���1�yԅ��̓]������Ӆ"��i܃��E�;EQLq�Ku��˘}v�y��FU���bV��$T����Do�M���3$�����޽E|��'x����ɉD\ $�a���� �N� �Dg��*�lz:����m�I۩5���}wZ��u���T'%3�)2�X-K=�VH͇M[���
�TT�&�Q���H�o[ٶB�"L�IK�N����Ș��v�t�J=��P��Аp6� P6K��H[#�F)�i�S��a'��Y��uP��lV7 |�<�=Qnյ/'&[B�>L%�R#Rt&Ie���x��E� .%�:
C�f&��B>��G���ioe��H� �&����j�|"�����%z�����gDW2+�	N����K��d�q8���{Iל�r r����s�d�M!m�Tr$��t��y�H}�zL]n����ux��ab��d�1?Q#����M鸼\���$�KI#Nx#,J�o,E�P�1.Y�L�X�b:>0'�)Åh	3X�3��l1qF��^��I�O���z�D���bfY�����pUT������U��;&��i�~�T�@�Y$ͬ��3!�(���K)�B�؟~{�����H��qDt��^�)�7���a�A�0F�w$c��̵��M��q�r-G�F�'L�6���ܤ�/�{6+|��� �in�^��Xϧ�p �>h� jY�y,��FL�ŵ�&>�`�"����6��0�%߽���
�,)�.x��E��G6ʘ<r�41>�6F)_��k@��F'�h�6�lT.or�^ԩQm���>c�u�a[ChLK<��-��<r����W�0�C��K��$��&�@�X����:�uK|��0�%�ՊD����\e�x��4��g¢����g#L���·�,��oT_�S*6�?��L2֝�2���L���~��QswD�(Jp��˶q�rL (�W�]jIs����Ty:��*���R5���Wqt�K �ar�Z�+��n&�p���h�|UfW7�o�?��.f�g&�K3���+�L>⭝8��G#\�r=W���M�>ܱh�*)��4�e�r�^�Ϗ1�~��a�ڏ�1MP�}b��FR�f3�;N�a"E����FLE��M��l>7^���`E��,%b���[W��dBE+����u'aSV0�yF���P#�j����a��4H:iM��m�&�F}�ȧ��<coum���+���(>�$���=g�/�=����R��(�&4�����Thq���)�������H�
�P�7QqN>�Y>>�:��L�p���6��� �?D��\��)D���K��B @�9�T�N	�ͫR0*�^4��(���L���Si�A폂
9'Ԗ��c�$p?��| ��d�iN�#�cAS����6J��s��<�1�R�/M ��j��J    ����G�u(��;!�K3�h��}n��*�D�-���taʃ���� �dV]��_����".�4�} 4i)��^O�W��^e'���fwIl���=�0~%�����o�{����qO-k,8�/�X�{-V���Sq �y�x��^8�!������a;ޅ)���}����8�+V����D��x=���	�|�v�d�;��Q�}��s*h�/�1ø\
�46r�)�o��<�.8�9:�72X [�3���@Q��١����D����i���7�f?;:�}s����z�.1�t���V7 ���ӿH�Fe��	�����M)��,u��7��{2x�����#=���;���w����z{xHnLX;�j=Z��.^�.U��k5�b�����ڰ������q\癟�_����/ӣ>�ϕU�U �*�0eA�\ŪTOO 3��M�'�Υֱʦgcg7��m�+g����T-���?a�{9����"�	ʖ���3}��>�sق�z�{���j�����- [j��r�9]�bf(��{�,�7Gk-�%���l�-=P��B�?Q����B� ]��C��fC�j���dCCu9+�^��}�s�%#�3�+a�B��a����0��	-��^�ڛ��Υ���JM��H�9����S8�+�Ys�:(�U�g�a�d-�[�7a� ���ؒQ"��᭎@�eA�X�P�Z�pl��$F?��_�UJ�#�0@KP��[x/��x).G	9������a:��%!��̡1Q9i̱2�4������#�dШ�6FzD�C�!j"ׇ�����@ʼ{��EG�1&)���Cy>�-e�I��KB$�ź��>Np����`��>g������Yd�*�/�/{_SwK:�&ⳛ3.����}7��vM-�*[#'��o#���6!�NFU�v,�Ȳ	�WbB�T�A�������������(�-"�H�e������W�P=��E�I���+��'���$���3ɓh�/#<6J�R� S�ŋ�~�sэab�s�b��AS��Bn��������~�'�| ��D�P�%���~�m�`#Y_���_:x��WA!V������.��@\J�l��[L�b�){�g�ؒoA_,�!D7��ϡ�+�l�s���C�Ǳ\��}�y~5Q��p�k+�����-�,ѷJ�8��-��ö
���+�&��U�W�窩���VU���	5uU�;t�OP���p�ۨC�
c:��s��҅�dzvY.�Z�T�c�m*�Z�T]C��S{��
���腠�i	:'R�Ao���(\��
tL���r�T*�]j<~��&eq:�zhbR:s��[��.`���	x`��%\��:����.�3�
��rC)S�V����Ҧ^p�F�B��S��8��j&����y��:�tS����ԓ�6n�]c!G(ef��)}���<BeXfB\�>?����t*������Зڹ�>ڧ2c�I��B,���'����I�w������@�:��.C�nWw���s+�r4�9�k��\M?��e^�F��k3n�=m)?�y�I�O7@J�Π���C��^m 1)D�jXx���N&'3�b��T�����Z"U�T��"A�)%H͗�eQeq���z¤�r�Bm��P�MD(�d(�\��IcDՔ�v��+$�{s����L��S�M�=�������l��!�m��{����3�����{	�"�߀u��ם�^m��mT�����L��0�}d�l�I6&��Bd�ka��kcLN�-� ��{I%]�I?����N�	�,����e�Wd�O���^�_��앓�&iH����ĚNL{,�ә-�hx6�p�~���Y�گf�i���&�~��аΐ����¡��=���J5Ͷ�q�a�ţ�����4�W?��K<��%��S݋J�o�	���Xv�jBˎ��R@Hs�Hp^��ZE*�^:��&}2�&u�������E=�C��C6�8�a B�a�",A��Pg�؅-��+B���8�B��l7���g,�-ʸ�g�M��h�U�4"���t�|f_����,�#u��1Z��8��,R ���T���8�N=���5��(�6�#�a�p�����&\���k����Z�yC&���}�m�|9�,LƙY4��,���;p�.�HF��)�}�0��Nɸ��������;�A$svƞmV�9lV���ZN�t��q�V���˱<���sBʕ8���|��	G5N�g���v<~�y��x���mF0(�Q��o��-
N,�S�<��G%�4�ۭ�� G�wpu�V�f2���2�MP�����2/G�qXU����L������ﭽ�����[�O���M�G/�2��lm=[[��G���{k��'G�^�V������l���߼����߼�g?~e��� �E��U�{k��5_�g�9>��)����/������ek���+��&�� �=A�X��g��ԧ2x���rsℴ�ȹFH�E5����s��~���r޿A ���/��_��;���ν��lr�����N�1�{�3W�-��'�,��9I(�L���[��^!؛K|mK
`�i�����a�u�� L�fНB2��RJ�"���:�Z�J|b�.��� �'c0k���LR�p���Z�����"�-C��$e��,�R��3�/E�a�\�~CX�WB�:"�`İ�B.������1��n�(#U���B>K
=��vW�6h����b�W	#US �I�oم�	�D����u����ư����Ҵ�7���W�V;�y��9i�\�O�A>�[�>2����=�c�8Bt84��<k��4o���tq���R��fI��͆�63�(=Z7S�ݩ�0��P�79��JR����z�8�p���⇇?�#:1��l�	,G�;�ȁ�j�3 �ܲ&���m;<i�pPo"����=ZQc���y3��%W�F٦�%\��X�����ӶJ��-ڱ����	�����N�����%�x��-�I�k��סF�(F�Tᗐ�����8iY�j�D��~z��E�t���"��	�L�(|��6�7Wއ֢n7#-d5��t���&����V���4v�R�̤��B����JI0�+��{��n�
W
��8���Mu�2&�#æ���Rv�����o7��XsIT�h4ij��j��.��#S��U�MUM��p��b��LE�mF�⫇06��궷y���MsNٮ�pc-����4ˮ�	+%�돸'Bm4���Uxf���<�����	�ro	8A����"KvM?D8䧳(s�u�!!,��eO�F
�wQ����[�f�z�Md�'����f�S��q&�S)ߟf2����i*0A�ff�j*f�bR+�tN?�8��Ê�eHZ:�y5��N*��9���(W�؄Q���� ���!��mp�:��>��v�e_i�rؿ��4j���ჭP��σl���)��'pJ������9>���]X����9�؅O~�"-�6�D�Q�����,\����R&�m��]|�}�o�&]�� ��>N ���}p��a̲`��Otpr��0�c������s.�"��9�Czg�b��Guv�hw���c��qZ�-i�� 1�O�o��p�F_�Eӑ���Q����7���$l�GI7ᗄ���`���i�8��;�#N:�K�=�1m����A��l�_��1�CƠ�aI��	��"δʦZ�{i��R�<�L%ȕ�d�R���*y�rxִR?cڦ:�\C�jL�JzT��G�Em�h���4�h��d݅h�)��˒ug���I��m�l�H�3j'*�-ƂF7�}�3)J�$ԏv���@8x�ĭ��)��d���\f@�D�ǴG�,���B�Y�V�>���q�7ũ��~�v��%L#�xNp�״ʴq�����˘#�A��SO�7�xR<��ND��Ҥ� E��
˖�!�HKPE�����;e!=�k7�#l5i���B���ؐ��]s�#�"    ���up����$����$��&d��χ�H����+Rvm��$�����F�/[�y܉q��#�y�b�Z���^�+�$�,Ե�q���gIh�V���*��4c��T�Uj�\�T�4��p�I�E�k���S���z��=L�5�0oo�}�b��:�4�{��q�k�b9l�s��G��q~�É��e��a� ����CE(�ݨ�3�!�D�G�aÄC�'88$��cqX���<�)�s�s��(ɤ��&
f�݌.�^�ٔ�%���q�)��S���xi:=~zb���a�.��(�d=~��V_xH�΂$��<и>���\�k����77�ӘV�rntn�8·Q0i��{$������U���U���B�2���d��\v��w��_����7
���'K�TO��	+,+<<����(@ї6,�C#\X���)�ZW�:p+D���Щd�dYN�
}rUӇ>b��0�Aeɼ�9�(|��<��8��L�?�<�խ&�x�SԖD�+j�k.��K��Zף"W������#[�yX�*\A���a�s#dUE��%�
�&���sZu�"/L&��B�Ƶ��-���2�&�8�*�1�>6Tw���2�9�t�d}�JV��v.��[PȅM��>Wz�}وb\,J�z�x_|rW�΅��w�B��w����*�
t�.��n�P����drp��#��w����r��3��G���D�\N�u��or�:�MU�j�.��*�m����]Y=���lm����+����dWN�~������]y������_�n��{_��ý�?y������u�����a��j���]��Y���_E�+�,C���a'���� � 0�����Zx b!�~Z�o�����?Rx b�9�V�,/��>����g�j��w�-��(���8���U��Lkp�� �9����s�Ԃ}$���|F&jp� `C�����7�>!��������h,��P�����[�-���ճ��X
x��]�^A,~��րLét����y�vO08��&t�;���7�e�|0ã��l�G���a;ĝ����M���B�T�>W��[@��=\�>��ϵqS:O��nn1t�}Pf2=��-&�������i�׻P�E�`A*�|F8.��4�}Э��@�>�`��>���[L�΁�EqM��f��,li������-vX*o�^ ��
K��d��KN�M�M�T6RY�Et���}���v��Rmec\�6��kܥ/�)�,�J�ߌ�J�ه���XV�d�W±�	n�QY����H�E�`s�m�l���Ƨ"��܀�ګʍ|Hȭ ��=D���1��7.@Mu���UEyLuW�$��;c3PT��I�~T��V&��<�oa�qk�6&S��ڿ��~"�n�ȍ݈��F�����
�l��t��\�pNa�5B���8G<�	E����@5�@�u����nă�	�d60 {�\������"����!AƸ�����$�e ��+ T�����F�tJo;��=� I�cM)K�*DS�D�Ϙ��>����?��3�I٣���Gπ���Piך�	��h���,`��oG>�b�D���p&�E����h��L���6�XD�,̄�� �����w����C4A!�xkF@��-� ���j\����U2{��4v@��9���-BĹ������p�ŉ�p�!ީ�K�M�ɨ���B��:�����`6#l��J��=�}|^:�僚-?Ic6��wY����5�M���64�*�f(M�	�p�I�+R�K�(^��R%5Ҷ|����Gk+�ˤ�Vrc+Z�w�\:�����D.v���ъ^FR�aP2+����-{���k���X��� ��s��ӭq`W>Ҫ�B�uS�\	9ʽ4&wpDNw\y�i�B?I�y
ȕ���(oM(��@�ߢ��k5t¸�ٔN�u*I&l#��~)�_��`�ҋd=_q?��{a��$D\[�2��U�T�	`�Ҁ���&UU�f���E�ln=B_�z�����ێ�zu������&{�����
��H@n���{�yO�~�����g��׫��n(Tvy�3U�6��5�l@ i��d���<�z�#<WiZJ���O�Be'F�v���4$����D�g�
���O;�4:�ٳ�#T�->M������Nj��s��G,�I椊�3L~��)��E������7�)>{v��6P��7��>~F�O8g5�����NH�sι9{P����r�$�t���O�ײ�xU�����n��u4S�>9��2{%q���]ڊ�z�(��^!Ja��1|�cz�ѫ �,������t�7� ��y�'@�]5�j�������_��?D��=`"���o#�?C�!����V��ƨ�w�>:�������u�A�`���ڳ�셔�?����wD��-��zs���]�����Av�S��y�#�����k�jy-lI�i"+�@`XU8KG�%m��=��A.�r�A�޴�O	;)/+	|�A��  �S{��SmS��J�TWN��F+ˢ\ }"2qR5�8t�ǯj�j	��;m�"5� ��Õ�����%E�R�.A/��<�3xIQ��[����������sP(���{~���0������P�	-��B��ҁ�+�C�'���Ƨ��ki����.��T��*L����Q���@l�o(Va \��YP+�ՒWi�*p3�"%s@�(Wt�(�Aw��:ZYJ��/�dO�.B	�a$#�U�2Bap�Hp�-�Ⱥhs��d�*#z3Za#Mg`��OX/��C�y�ȕ�Bſ��(�����y;q<4�⹈����$F��	�%�&&�o��SDt�iLp��ы�]F)Ճ���R��H�o����D��7�o������9��E����!w#B�("���H������6ӂ	�%&��R<e� �=e�ļ��kǸ���w"z�>�m��bB9"����a�=��qH���`�mh���"⌇�	�{�i2��� 1Ghqգ<o���0dO� �Gs@3����:O�t��I�*�W8�*��`,�#��䌒�
D[}�]��w�`��"8M?"�v�'��q��&�#lĳ1����O��8����6^�pkB�	��D�F��lA&@�a�bȦ�I�_:�4%v�{:�iqC(z>ŰD�q�q���B>;2��;�Ѧ�X�ۚf��ֲ���O�xD5��ǃ��.c�	&��kr'�k54t����hL8F��h��GsAǂ�#��x�������&Z�G>wv��q-r�ȫf�8%�ȅ��W�҅	�2p�Q�դ�/�sƁ]pk����a�]B~Dh�˾(m������?������:d�A��4C���@f��Z��(� �=�������Q�c�m0)����J�ܣA�E8�!c��/]�ǰh"S����؄�`;�p��)/gJ�����p���G@��tlz!qw(��v��pxЛ1Έow����/��z�У;�cc�º�/�Q�8��:��~sF]rL���X������|�\�����2���	�W�a��_�~��t?ͳ��|�l�^(Y�}}-{��e0{�ђO`w�]aΣ_@$�[$\�N:��/(C���P��E�V��l$�y�J�K�N�[�&��Tke�n���ɼ`���zqU"hgd$à�L�%'���� ���T~�f�E�E�Ҽ��]pG�V�`w�� rG�R�f�a�oM[��O��R����4�S5l����c�M����Ǣk��t��tx�"CR����0&
EG�	n����xR B1�U,BT\1l�64����}^��6n�SN6a��,��RJ��Ms����6�A�l�b��u�j�0�S�E�%��_�KL���#�(l�*c�KR�&f"R�����w/*��D��(=�g2��\&�6,ls&�ԉ�B��0�Jb�K����̉��8���ʂ�N�����-"�;�>D�Q\@b�Qp�]KWj�Ų+����Ծ7��ިm��6lʵU[8��j(�/    ���x��|\9�+oe�D5�U����5c�\mc���i�n�.n ��*�]\A4u`@�-�4VJ�����ٽ��\O�ۙ0��R����:�u�p�1�:zH����k.�H�W�\{��!ˎp��^��d����.��'G@"5�1v�n�8bĐm���~uj�0잡F����C����d�������	���u��㟣=�<އP�*�J�c�ǔ�^�����:@�Xl���O9�#͗�/�S/��_�
��7 \�����7�N�&X6�c��(��e��e;ǿ�X�����V�\����͘x�ex�c�)2��KR>����zK��ڀ�DY�Z��}
���r�@��TX�q���Q`65"Х��S�UK�J�*ї��֟�ۚ���Pf���m?���ڬ���,��<��U���h�uk� ���j�����~s0m�⳯�Ǚp'9����b!A�L�p�D���JER�Ȩ�-+����YBM���X9BP2vV��׈)�)��MΝ-b���\ F��D���m�䙞���j�M��w@�y�3�\9��8��ae+ciD�M�!],��^�'��rB�f�fWK%<nʮWi�������&���}�A�h#aTPA)� z�G�&	"f�T�˺�P���"���� �%�>�X�*w�\o���թ�Aܘ�>6�\A�G^��g��0S�
��LvJ< �-bpC�hQ�W(`�أ�[�e�X.]�Y���w�Q��j��T)q}�z�!�T`Mu�ɬ@%�`��YO��#���*�z�)���9��bM[S��L���(DO�8�_v ��H+rK_ 6���n`�Ԅ�^8ms�˕��|4�"��h4QR4Ubr�9i7*0_��l�X�vٝ*�u�߲�{���?�/�k����O�-ҹ�۩��B��	�L+�S�3eR�lP�� U�rbY��ĻTբP��ƧZ������5����ȧ1G�d!5G���G�Q��M�.lRp��U��d>)�#Ԁ��7�i�W$���r�D�*��,�(+���x3�M^L&�sU6����5���'�h�/"�."��f�1Oޢ����M�Î=��!z���r��E��"��J�&;�pa$�S�T�[mS�yM�^]	}�@����g��v/B�.B�.B��C�L*+�2��M�E1ɍS���7�8M�l����/���	S'��?�����m"���N��}y��O��C͟dk'�����70QXzؾ�2��#��i;`Y`M����2�Ep����zH Ȳ=�D �t��=�K|R(XoΖ�}�nzڸaP.��s�zw:�~3e�>q�O�ߝhL��˄�N����	�>n̟Z*͓�C�1�� 24���(�KWvvmZ!���ӋZ Q]���1T�ɒ�d����{�d}�p����:���y�=\+K�M`1���xK�؎�"0z��8�Eq��));�2��?�^�1	�����e��@�ĘD��� )f2�EC�K0^	w�v�JZ��M���Fp$���nt�p��E�e��1S2�H{r�H9�	h%6��Ϡ.��92���}�ڢHy�"O䑉�^��U�aJ
�u΋�84��pe��H�q=Ϋ�(U�^>�;�C��,�W���寲'G�g����F���7�D����DT��=o�u<غ� �-�L�w�t oπ��;A�u��_CH_����=Μ�g����x�ͫ�~��H���깺G��G�_���;���u���|x���	���~���d��43��ݜ]�O��.t¸���(A�!�.�7g�3�iŚ�W�EW�{�ƃ����u���h�b���r�~v:E��z�>�o�C�89L�I�T� �%{s��ߟf�i���OU۠�R����m�
:��d�z���˧�z����,25�ʖ.�9C1����B\lP}�tXX/z���V�b�c0|��m�j��x'���q�6��e���\�=0Yf!�y��G��a34 �>P���b�+'-���3�U!��J�S�4��"+(��pXv^㜑H�tH�g��"6<e��Nvy��A����Rk�NtS`d"��xބ����-:�n��G�M��ܠf�w�ϤV�&N�����\tv�%&6�n�0���R��J��l=Bf�A2o��SelѶs8�sqO��.��`s���guq5ϻnEӚ[xꗡ��&S"�<��s{�e�-�$ ��<�oݎ���-��]����d�W��r�����ذ���7.}�>|x�_�������8(��
Gon(����C)�>_�/�6C#K)0u3E*X�T�nad�ՃN5u��%��V^ �O7b�%^�@�/P����v޻\�|($t3��d<�Mm����x,Ӎ��zv�/���5 � 3������L�z���Xu���8��
�5��.]�]6z�2?�Z����쀢��e���{7g�m�q����`��o��0�ps�rڰA�R:�n�]������pG/�o��9;E~���9[�WZ��w�=���h��h�5n�V��Ac��uB�y�ץSٵ q�?���ϳ_,�:|>{��4���#��o�z>�tީ؋)g?��]F#��70��C��#Y��E#�|���G�:T^�L��Nn�^]��f�*(θ��.@Ke�:�|�K�./k1���ڝ����.�J�/@(���i��o��`}�[�M��j��O��G�b�\vR>��Z�z�R�k�j _'��51Nb��guPX7h�W�60�%�Bb�%/+m-���{���xs���ł�"v,�X��+�XG�1y����B�MF���JG���ΣVu>Pt�(ZXO�sn�]�-�Ŝ�fc���.�~0�L]v�u	EZB �1�d#m;�a̓P�ly��@�$���)�w�\x Z��P������I5���Fҽ����)iS.%�@�;u82
�B�@��B�#�A����3x՘�EαD�	��*H��[1�{qWl���ژ�%2ʚdO\�pq��ڛe�H^�u�A+?G�X���+�0T|i��ב6N2zVړ�#Y�b���2��h󭘩8�ů8qs.ٱF#?�;�vW�3���/$7#�C
)�����j�&v�W�X�ʆ��;S�a�EVO��B|N������Sw�,0����U
�e;8���KV���N��ȼ/!�ҤBF�D���T�VQ�T�1�����&!�W��H���e���j�{/ǡqte�9��8Eh��{[���]a$rt�۲kp�^�Q<8D?��`��+���5�k_�Q2�В��㙪���e��y�\��[��92@"�hXЀg+����QbH�
_���(O�T�L��H�J�5E��u:7����հ�<d]->v�9}�w� ��Ȭ����7�B10D�7��A 0#��q⥗�WR�#\q-��A�?�Z�e6��,%�pn�؆�E��J7���$���vuS�p�ۭ>�G�x�j�a �
E���y]v�P�	�(%P�SpݽOU��I�8l�Y�s��e�s��]��ƿ�z�j&���壉�������6�}5������:�3I��z��g]o`oUh(*�Ţ�ڢ֊�p��a�
i�E��T��K]l�I%[	�xG]�6v��P��ŨhtY�ܻ&\?�r��*o�Zz�'���K�.?s�����ȍ����tA�;x6n���r��^��/9�S?������~������r�?���]��<~+�R�wȏ��`�;��>�2���]�W�8�ë��"gx��~��������A��ű���o�����ɿ��w�;��ex��2�Zݷm��~�믿��w�NxT��/����p?�a9i�4���>a#ڜc�5�����5\\�6`Nӆ!���Y\��i����=�\(V���l��o��_�����������~�Ib.k	�3�2�[��iN*NH�H~�ө�k���>sR�����deD?%��׆kj�u��aR.���}~D�v����p8�5k�d�n��@���s-���Zq# �	  ��ʗ��@��f�G%���A��/~�T�1�)U.���F`��y�1R���p!��[d��d'��r�LW ސ�݌VaM�D�g�T���v��&����	.���"���|5Z��B�3��P�m��6p܃�=� �'�c��!�e��Bꜙ6ی��~UGO��>!W�<����ܮ�$��P������:4��,BQVԹ����&��Vz��h�_��W�8��h~o��l��'�����{��=z����)[}���7ֲ�����k�x� {)���ÿ���J�~r�g��/���/?�y��o�}����WY5w�vh�����+�ߧ���O��/��f_|��[����?gr��������^:�9�3��:?�n[Y^�����D�}�W��c���c��`�7�F�s��{٫'G��:�"����q����xs+'������}��]Y=���k�o}�nx��!���ŷ�C"��z�P�|�}9_���o�V <~k�> ����ad�{�p"������߂�z5{�L8��D�ހ��p���i-�Ē°�Oh3��@�e�R�Ru
،�ͩ���0��L��5R�ĩ�ɓ|�
���ԧ]��"Cs���M�q�7�x� ��4[���P�C;^\qy�Ax�+G��3��;���f��Q�y[��
��`؛�Z�M[��F�M���3eE 7�ds�·��R:s���Ep�:���}t�j��CO��d�g���s���ms{�Q�^����N9��+6�U���s�����N�gi� �x�}���q��B� 3�
�#�6��mr��@O��*�n8yF��ӗO�ŰL���h���8z���V_@����=�o�FJ�M/��@􌸅h}b�9n�X;�:�)�&^rލFcasY4*tg���M�܌���bTO�{|]_��];9���`H���I�b������=��_�^Eyw�z��5^��~aym�w�)*w�|�B-��%3ׅ��X�(^� ��.r(��f�(�E�!�s�M�HmTt)S#}�M%�9���Ӽ�=�d�1Ŝ��������@��Sht8»Ӎu8,2�vcFr���}E��V/3�P�m^\hǕ��^ 1M���C�;ܶ�㶦�mu���ޚ,h�>$�L~�({8��8m�r��Z��*sUO,R.�q�W�{#k���8��>���9k�D.���4D�By�Z��m�T�^�E,�u�W��1����b��������)L�f�n�k��]=��J׮	-s��I��XB���}e�qu��N�_����-���@)����w��'֤�Y6|A����b�2�`�	%X� �0T���3ʦ��I�Z%.�^�V��r��6�%W0T0�x���hiݠ�m�M$kի�̩+_�DG��b��]�Bw�����l/v�<���1����eJ�E�:J�^���s�sN��f�ҨѶ��̕�}���(�����i]Y�T#�(;�9��П$,'DV@/>�ax����yáJ
-�JrN/0#R�ƾ�x݅���jp���.5�xl��ݨkՄK�ۼ�U�xoF24��"�a��uw�g������w�N�w V���������$�{2<`ps��8��݅y��qZN�%ρ��j��0N�Z�����n�tY~r��Υ\��p�	S���V���e#M�~p�+��)h�ʶ�:ը'콩ޱ*��ƛ/Y�)-ۯ)]��\]UD�C��j�%2qm��ѓ��d���G.0�d��E(�ڀ9��u.���U5[���%�=C���ם�4\d�Kۏ��d�z�KZ�B5e��
��Q���Ȅ/�pecݤ'��Ť�#�v��\����(,!3.����친�6��Fx��� ի�����X�����@�n�Hn4���pS�.ʭ	�<j;�%���[*�1���\���x�:cO�����]Z��Ŵ��T	���!SQMQ��/diSU�R�����|��C��ڱM4��^��-[��T`ۑ�EM��&+с2�2��gs���}�\��W�>�$���D㔇̠��e�R#e�83�G�
�}��J��~2�T8����\��ړ��[-��'9����[�=�r$'��b_�X�,�¸Ex�"����W����|n�;6wQ�_���c�rY����+S��Y5ۼ��~�|^�p\��%����=���e3�LB���IZ)Y��Z��z��IX/S��&uI4N��6u�c�]\U�����SsW;9z��I�ҭq��\��\��\�m�k�+�zx�sՌ&���:�Z�������`��׋$��x�A`��
`���B�wY#��
�A�Kj��j�ė2TQ�K��I�h�ʶ.E�(�vC�(A������6.���j#�ژ���Mh���#����\V��zR��6�xnp�R�Ow�x�0E�� ��B��6m��&���n "L*��'��>lk��gq�^�t��r*q�      L      x��}ɒ]ǵ��+���웊px�=��M�e� 	����:���in�P �BO��@��t2s����2�nE]
k�Q�$\o��G���)��ZeaKq��Dj��e��~p�U-Ea����Dξ�tE�Zr��K����~���ϟ��ï?��?������o��o�������}����/������>�����;#���%j����������>h��P
}T����.Vi�"{*y� �KV�V�������O�|ꇞO����ˇ�c�O���{��~�q����������$�ZZ�9��DLOa�9��ղkm�3�O;��Q�r ��J�pED�~+��g�&d2rdW�m�O;Џ���?����_~̿��s�Oo:���
�8Ҩ��� ����m���U��w�/+�w5��h�X��.BC*�M&�ܪ#Z�|3v��a�k��6�Qjv�]�|ƝS	�C%�r�.�nCh@Pt�&z�6~���on�2�
��]���ug-N��%[�!����WU�7�ǻ�z�2�UQ�.�hmM�Z�(���L��:B�<�_hN'��u�V���YS�{������%{�}R��2��^�91�R
���Y�������ޓ����T=U�dI�ΖlJÏfD7^�#�Ժh���qz���&�����n!M^�]��Q�R��ދZ6���%�4�2�K=IC�B$�Z�����R�糛�U����A�"JCd��T���a�S����%�~��8@b�j��\i0lU�Puh����1��b\omt�1@;uach;sF�2��ʤV���V�ڼz����SpB��jY�����H�����E��+�:^��z�
�q�W�4�<��ncխ�Tm�����:�&9�z�d6vj
��-$%�X5=����I5|#�0�!|O�:�s&��+�p�Ԩ�<6�1F$%�=A��[7B�����5����O>��$��O���5����?���[�����_�}����O=����_���B��>����E[X$��6]
#� �Jvld�۠K��S/����oY�1�(!�m�ʥ���H�7X�t=ͯ_>��^?���?���'�mw��Q���J��Z�ǆ F8|}���{{2�?���ڃ�%<D��X�uA*ךs���x���by��_�(�k�K��T>��?�?}���`<���\����'z:���;��i!�����<8{Q:.Ɨ�J�"4:�Ix�0#��:z�*�0��T�3c ��p-v�$�ʣ+ݴy5��/]?|�D���g�E���-��r��_��K��4�0:�c4hr4=�*��c���:���� ^��E2��0����{����_P����c#���}|��������p@+��(ӃIR]��xh.�G������hH:<���ti� ��V��_"[���Q@G �N!��T��� ���n�k����<�^n��
ex0�A��o�=e��*Ux��%(����/3����S#�Ẑc4<�@�D�:�6�w*�3����d��z���kntLI��G��P撔]t���X��/2�����19J5E��J���Ő��M�0��)�|��e�ECDC�0��9ۅ�>��jKjn�$o[4��kw�p�W����)	�0�n�H�����l+D/�ۍ�d�&u�/fx�C���hY�:p(d�_*��Cm�@�C���oȟp풮#F��}{�Wtl��;�||VZ��o�z���TB��Ge`�d� ��Z��	�D��.�l�N� ��q S'�x]5�X�&�4�o�$���p�Э{$ϱ��ӳm��Qo�M�h�B��xg��Ms�i�V�C�*� �ɚMƧ�#��wO��]�v%#��|}�=*>���lE��=0,~T���0iSXZ0��W����~"�C�l��s�s(?	�l
VM�c'�;�[�u˸h��G��y�jȌ��(`%����e G�p%2�6�.��
���	
r)��!<T��l[�/���W{|.�q��7˶�ț��m�z��R3��	�F�N�<�����<�o�9���_��p�:�5��{��N������0y�)��_>��^��9� P4 <� g��J�q���r�]��������ȝ�s�c�|0| )�Ki��\�����UU�+��M�u+j(�A#��bҞ��pwܙǃνs�{S;OФ���.��f�� �Y�#.��EW�� bsG�f�}g��Ξ�=������?J��#��{�IH�H�ګ����m@�Fj1�9!ط��jgA�ം��[O^��ԋ �����$�����7o�Ww�=h�	��b��P5Xs�CAm��~�7؜��W<�N�f�#�4!��i���Ð]y�8l��]�g׷���V|��<CFy��"k���S��P-��Z�� L=���(���lo�([J�xF���7������^43�QA{�5mX�NӬȀ?Ѻ�&^&�D�%�i����yh�?@�AOUv�&|�]�g�|,��ѣ{�Jň��dd�C��[qN�"ϰ����%�5�L�hi�ܹ&��ٙO�ts�S���� `q���KJG��R�=y�����Jb���jf2���8�M7!����/o�f�h	���pqV/�4�*��ؙe�0ɀX\T����
SN��}�aw����s�r�`/{}vU? '�F�C	v0n �ģ���k1pn����M���dc���?i{p(���������x����r7dv�x�0��Zx}J��e�j���" (�U�{�+9B��>қ��x}�]����߿�E�?݂�tkt���8�e���e�ՠ����$<Qѥ��bjs�YR�2��N	�	�n����>�
�_n!�g�|�L?���{)a	�u�M��Z`t��HF�\5�è��Q˷���1i~���{�o�冸���H�=-8�'X�c�aEo	�#�;V��#�ڰ�}�����������/�d�l�Up^�������ߤF���R�E��2P�=��RNӺ��S�)<��'��KH�m��f�b��2�p���$r�����?�ե�=�;��]��0C�� vt�)|.�[�� ��Dr�N�%��Y[
t�Tݬ79�㋭G�p��Y���!���;�X���Tf����h����5��I�"�,�!Yz2H>����z���zV�M\�F?�s;�Ȑ�Z������y\5̎b�V��DP,�`�zϾ������b�l��"�7���ۜ�~�,�k/
0hj�C�*rt��?3�5��arT���2�<\Z�
�-�,d�A�3|�W+7w����4N����&��T���[�a����%G0�X���_��8��ӭI�x?�sx�;!��U+����_�_t�Kʸ�d�Ky�X	d�W�q�V�nZΙ�Y/Y�ܡZ��,�H+�nE�3���v����i��!���c���^z�:1\iJ�Z}�p��Ч��l¤w2���#^���a��ۑ���p<�'z���TZ���XU�z֋(`T�F&�\z��pT�=lՠ@H����Hz��d�}��nd�f��1����2�7�,Yv�qs�A>�12/�ڭb�o
��0�Mu.20�7w�q�(w���,���[i�!��K��8{1
^�-�7(`�9 ������a�, bRS���\�ȶ�&
	vw��M)�����CP7,�l,��t��rK�����p:�(���`�l5,	�!N�;��zs>��D�6��3M���^27�ߧ��0�GZ��|�v�M��XM�+�����4�o�,��}����<۸d�� ������5�c�e�_����I<������z7ǧ܄��3ƚШ���&�xѽ~̰�B��x��?nOyJŊ!fH���/�|18�>5F���4Z�Uf#��I\�
�=!���� ����˶�5��WB8ע��blP��%��uY�  �d��L�ó�6 �:��7{��yzRV��/�Y~f��:��B����%K&R�E�#H,5���6|q �P�G`)�\8�mт;�S=��z�[T    �vƭ��er�z0c��VL�w5��dL	f�hB���5Y�1e�)�{��P��9�7�oEL�1�b���R]�M/���ޤ��>�T�Ez�@�-�x���c�!�-���Vkܫ\�cm^햁K�Յ:SL1ͥ��!���s�q,�&ouU���#�r�!6�,�B�
)�4�*�m�M�X�1K�Bt� �B ,)�* %MJ����{q�}cѺ�.�ڻmp\G
NtϺ� �L0�fu��X}�^�����:՛��V{H�l��^��f�Q;�X��+�Op���7|�ǧ� F0% <�)�m�l/�7�uC�c.����gc�2s.^�a�&��;�,CRm��E�����3|V��L�7S��W����7|��=�&�"���hغ(5}"����*�h[1P�L�,�aU7O�ro�&��8�)�=�l�1�x�l<1��<�C5�6�G3@� �xf���d>w�[�N&~�Ү�j2�=�ۈ�!��L"oN�����Ol�q�5�xZ^`��\L	�3M�؊=�(���.�P��4az*�߀�!y֯ݳ�r�����M_��pM#�@mFt$�N�������6����+��_�jt���Fϟ_sK��*�t�͂'iU3�1�v���W$�SzhF��0-�� �¬;~u�Zo��, ��g+��uL��K����ob�%��rR�&9���;�Φml�9����u$fۜ}��b�b��w��%�C L@�!��N�NI�}�-�p�^�Ğ}����:[�+�!=��3�H��V���(��C�ɪ��d�E~[��Σ�#��I�S���tL�F�:��ϭa��t�u�L Z@�b�V�[?H�f���|��{��E@O��ujn�|���f�<����R���f�WMQ$�_d��I���dQyU)4��2o�.��4IK-ka8^����ʗ7�V�k:Z�8άQ����(�k�%8:�L�݄`������������>��=ö��Zx���ؤ�Q�.�wB�e\*z��U�i�'�_�Qu��c��V��r����-�Q�Ψc�����`a�5�Ƕqp��Mf��>k5[�:�ǺCD6Q��G{�M����ZQC�5�X�Ī�4r�	_i2;13�R@�T�)&���[��<k�fh�p�S��N^[�U5+�|\�5)����Y��)���ö�<�tr�Ԕ�~E�n�~>n��^��)|��xqzÂ )`���ƀ/U��l���晘�״�?�l���_B����#ct�� �ڭ-*]��8P0Ò^�f�Y#6���@x� �-��b만�(f�� ����t�K��b��}ކ�~���c�i�tZ�`B!�(�^f	 ���^!�5�j���Z�φ�ͧK̞�KB��LE�%Z����B�T�g%
;��JuYJa�e�uV�ABU�;(���/t�p ����(�	��"ZG�W3��b���K�z�`�CCۘ� 4��y�^�G�}�HAP�Lx����� ���U�ҹ��r���
�ͣP<��q�#�5��_����D�� �+;*e���q��v��?�ħ3<�{/����1���6�A�XҒL��4����|d݀w�D���,�fŜo�ָ%j�;��ݽ�`�H�Vk_��ؘ\�R�-��a�ʝ]Nb��^���#V�,�����ðC�mo���>��1z�GP'�c���^4-k`[b�UK9gy��Mx�>%�O������Y��Xԯ0�ӈ��5NӚǕ��L:asG���9��a���s��7���>��6˧:�ʡ�z5f���+.E3��3���}ֿ|K��KL�I��9(�����į}4lb��:9���	WWLt Y����jS=�2鍽k��.�sv8�g�b�KZI���2Kpe�������&k���`�;;���J��֨�,|����l��źz*|y�U�5!{�k��O?�-��kϓu+SznĖ$���$�&�*�b�Z�?#�y�^&7�����,�ZL�i8�A0��2o���5A�c �� ���I0Ĺ#p,�'
�RW�
xX�c�@�M�2�@�U�ORv��[�ˬ��+`��u@Y/4xQ�NqF3~F��T_!��M-��ܑMKϽ�. ��:�ٔ��!,��dJW�ςN���RJ!6�tyN��])�K2���m�cs��@��T4h�T��T�b��:�����E���ܺUrҹ|GG�z�]�o$�d��bK����bYxuI�.6N�7t���XK�C�P��'k��@�<�J�.�O �Kh�Y�V]�L�����]f�rc��BF���s��H8�q.V#�h��p��+�6��P�����Tn�5���횘�v$G�]�s�MY_�m���6萕��z�g���4\���s����[�Ⱥ뵔31X��j@gkj�M�4��Nc��E%��
��O�&��wM��|ˑݡ\�:GxѬT��Rvi�KɐԄͮ��x�j��j���y�o������_9�s��'��'�i�`4jX�d

��c�H+r�]��vp�ژ,�x���9�U��ټ��tv�^�ш���T=r	ѳ��4,y���iI}�����Wt/<W�<��&�~��;/k2��Y�y�+,E80�^lb���j��$G�d�A�'�6KDxؚa5,����>��f������`�\Z|��Ab+�,���\>X��E(��Z9�t���5��a��s�I�����Gޕ��9���¥(_5i���[��N&_�í��:�����Z,�	b�a��d� ^XC� �T�ss��w��s'ɽ���Հ8> RSZ<({�0��ER�0���6�y6�ϙd��H���.��=����Φ�o�<6���<�<����ER�K0Iz�k�g�%�k�+/����}��$�*P#J�m-�+��,<�|x���ܑvw@���R[�B��2K�ʹ�8 ~��,��"C��*vr�HWsxe��8�	&��~��zh_많�׈��a8'e��NB3�bb\d*�i_A9��F��C��,9A�b��!�o?��OXV�\W3��
P8�,nB3��W��ٜ�pf��`����ë�_�H
*cZ��@3�6�������匃��_��X���S�T����sF��HP^[s��!9;����d�,E�sܕ�� M�
X��XE������\���we�\@8b��#.Vw��S)�k�/����n����Ŀ�U9V�إӋm��2 �i�}��*6)c6ř��Ƙϫ+�n�>���T�#�ٵ}
"�q�>M3�8����ʇ�a���j�2�]9�����%� ��j�����}SP�N�=�ڶ�.4�R�����/��������G�G�~�������/?��sn�������wHFnBi��*rᎏ�p�t�ʦ��b-g#e���oe��/�n-ޚ�ڱ�4��}ｗ�������������${o��KG3XRG�4��ʐz�ݜD�c�p%��OK�\��44 �sL���>T�ÌI���r%�o>A�M�^�l�;aZsx{��w�Ć��:Y�8�2�=q�c�^�c�H�e�Y�ʹ�}72k��c��'ӆP�;��-�Ӎ��V�Ӹ�`����k�w�9$��t��1]v�&��{o�˗^���i�����,6r��tF|������\�s[\�1a�����Qj&?5�� �f��{o���Oc|��� ��k�Q%oX^�����:�����`]��К$X�TKыa9���q�>s��O�����G?���O?��BBM'����2k�2|����ݞ.D?h�1���x�̮S��"��m0Y.Ej�_s!���~�N����Il�;���́U����`k���21��kB`~�m��Z�����"œd������1ѝ��}k������ٌ�BvF��Rs:Co�qc�����5KC�F-��aG��\N58G�[l�I68;n��2�7��@� �)�����^��SuE����c�Y�l��ġ8#��`���O,+B�zm���/�g��>�-��    ��=�#�EA\��k���}p\�]QU5e��)Z��ڏT�6'�U������o��߉���Pڋ�9��z�	I,,��k��t)�ef���/���,3�k5\�� H>G�Tѷ�E�ݥ�����	`��rPy)L�A����Rt���%Yp@'Z�z��d����	F���Q��
�����oS���Sk�S��J��]��k�]����ť&v�),��ʕ�>�O�}�����wI�]{��ey��p�� �%��{Ղ�no�>���r����B��M����h3�tSA�T����۬�6LJX�fo<�������	N8�ܤ�^.��>Tص��}3���{\��F��ى�"wjǡD�nS�t. �'��2l�Y��@�H�b:�^`��S��q�����v��KO��?'��V����s+q:N�����Q �Ӷ(�\�����_���qE�����lL�%�8�88�jx8�Q00T� }5]�ٳo�߼�6�vx��^o����zQ�� q��p�`b���T*�Gxms��_3)�Sm[��+A����MnXK.��9�ًc@ѸF<z6����s!VQxE��$M�z��~��d���H�us�^7K�uf��K���AE����,J�qR�jL�}�VO��+��,w۞��rz��Z�Ż��$����Э�
��;:B����qymr0�dM���9ɓ%���2��'ׁ��UvZ^�Z����A����M.��$uh3����g��N3�F����(���V��{[\t\��d��ٿ �g�g�\1�:�n
ȇ�#Onܜ2���f_�����~�;���糉��p��knxNW*���=��eS���6&��vv�/��S&xC�[뭲|[���cu<�6����>\�nM�"�;�t+Nڒ��@��ȑ�"�8BSL9-�؝�����FԞ���$��{���y���%i��HN
wN.3$����42d
����z[3��s��a�&|�=^���Q���,cȡ)2ê�hٲV�p�.�v?'_���nu��b��ȍ/�N�����n�Q-4���� [���K�W�7�/�9�)�2��0�F���;8'�C'�ﲑ��;�N�C��0��#��e��jm�f}�zl�8��!3�*kc\�4�o��p�*}�u#M{�{� ��>�5�o��E��z�2��%����-���/Nn y���?<�!�H�����S��\sV���<���n<y�ģ@����:����>G��>����'�t̃�+�F��X殹�V--�
��RPDNP�G�`s�do��eeWٸu��Bv�l�r��^T��[`9D���s����R�)Hg�y̩�׮��щ����v+ޗ�<(��5k4@_�IKVnZT�ݟ����Nٌ��`L���CU�'�O3C�]��q��eb�Kɍ���`���0��Р�6p{S,�-}������2��k��NZ�d)Z�ލ�{����7�;K�.|�ױ�� }�(�$���c������K�����jd�2��$���lH�p&:�2[9���EwOѨC8�4KisĝM^á�@�Y�����*<�8`.bU�T��gɹ��d�frz�������c�7�;;�ץ�k�1>\p׋��F�Z��Z�5Q�૖�Z��`�~Ja����o�õ����Ɛ�p��P��ڿ�Y��y��Ikm�aJ�ڋ�j�ƢZFYX��A5Ehv�Īr��[����tÞsz98��x�/�hz�	۱���!��n�C���,t�&z$V�Jsq),*8ʚ�[8��9�8S�`真kD��k}�-F��=�}as�
���a�f���P���H9��	���A#$\�)�k-Ѕ��Y�[̟��3�6�أ9����_�s���^'��������`�ˎ�+��XUI�N)@m�7Fb�������*g��*>vv�����������Bqњ2�#9�{J���?=q�c��M�k,N�>�h�_ú��%J^<^(��j��36�«�]$� ��s�H�^� E�; _�Mw����f`�n����0"����� �q�׭#8��lv���1y�;-p�dɾ��F�Jw��9O�m#4_�[qg��-�q�R۩��e�P+e.*�d�+�n�5�8y�BK��j&D)�=�jA3f�,?B�9H�����������v��h��i_��3���ZIu	�.�U���K�Nju�x������\�����8�ۿ���ژ�]�j$�gvR��wm"0,�����&L	&Y���nr���2�S���f��� �5L׍|Lp��c��4F;,�U�4���t�Ͷr���dK���s X�a������7^n����OwX�t�u/�T=����P�]�@EV�cf9��aZ���܋�+h}�9��,�qZ��~��IBn%2��ݣ�S������J<P¶����:M����J;��o��hvȱ�g�:԰%-y��a���9x�]�)��6�#S����4<A��Ob�.�1��ոNb�z� ����(ir�l�*9�[0r���&�io����&��@7b����q�P�V\.���k
��q�)!o�(0Dp��=�1?9��M�o�p7'�,����;f��$g&H^�RA�|��}m�*��:�<��i�$~ń�;�g?d��{��o�Vk�o�.*Y"��#���뷺1�jR��7�O=�Wπ>��خ'����l!��u >�A�>i���N��:��]�����s�wJB�o��	��?�����Џej,�R��c�2+���{�B�4�`Z9k'�O���=��,~�$�!��-��3��)�.A��9��s�i��e�������peؒm�+�v�1S9D�P?e\���ҋy�+9/A<g�����A'y]J��a-��m#���Xg	�*�kQ=� (A3����}Í6H��C�hǮ���L��>% ���w��48!0<\�E� �C��p��k��~��br39g�46���,9S���EY��P�w��R�9��g%\u0���'+�&Y����m<��غ&g��i>���u6��KL�c��h����5+\se���4�t?�ĳ��5nw<�8qW�չ��y�(�aR���ve��}J����b�{��(z���}k�6U6��<n�lm�mN���bu-E-\�d|�^.X��2I�8c�����wǃ>[��?��Ai���:����� ��k�9׏��N���K�)�9m��3�Coe�/7�غ���v�f`�=nU'��q�ơ�b�}`�4Mf6�`M�F�DҚ�Пb���ֻ̽Dw���#��i�nW�~�5g,|�ե�
ýv��Y?C��d����������)�f��K8��D/*.Х�X�kr���W�*V��qNY���69���r�@��x3�1@HG��P5�.��1U�h������j�����C%&w��}��y���κ�'$ٕ�]w�h?G�7Y��"�åDV���'�iƶ9��7/q�Z�	̟=$?�|ѹ�&ǝh����6��~1�l�2����e��PG�K[�x&ɜ����1���$so[|4A�u��k`ƀ�P��%o��Y�O������;{x�'�ʄ�z(8�K�'5�����3�Юpp~y͕v��#�_�7�m����Xc_/G�}����� �.6��H�%����;���n��5��%��u�,F��/ H��"��[Áar��N�S��@<�^���ٖ��:���s|L��-Q�xb��%�/2�]��,�T�mD��K���f_ɺ�=��K���+m����w�V/N��L�b�(Wit��2>C�T��2�_���X��R���W�|5�kP�F��N�ߞ�T-���)��*]R4�V�%9�Ӧ���ܢ�X�����\��̩�� :��d�R��Yq<ӑ�o���7�tS�z�]���J�2,�F]�+uJ_'E�9ь�  �4|������W~�tv��U�#�+�z�_��\���]p8�mbĔ�^�$��D�Vi��U΁�ۻ56/�� w  �q:.(۟h5W02zQ	�aK������Uȃ5u����L���
��7o�����N��[��� ��:d��J}x�U���e�צ�����mÁ�1_�0�*�#`��μs��=��E�ͯ��&��2K���+-){ӵ%��p�:^�U�������ﯘ���V��R��ǽ��m��Z�����E�`f->�p?���Ă �����- ~d!}O�;�B���s����;�x�_���ۡ��P^;֕d���Q�
�d�_��
�)����]9�<�0Y������9��Kz�q)�x%�gU�b�dxQ�W��Y�����;���P�I\��K�T��:gvy����ʛl�1��âcu�q_O?�#ܐ$	�� ���l��̀�G���[_뎓us����lwe�	k�v	�Ȝ�!�MOיa6SW���@��3��p�����ی�^K]-[.!�:S]P�a;t=�nEh�8{�ҷ���Y7���7ٔ�j�^p�}'1��:E�('~8%bXǭ��a4�L�����{n�ݎ�/�]w�b�#����2��j��S�㷳��� �a��ɖݯ�۸[�p��m��5k7�#AT���(��!I���E����+�ì�l�������	��fl���-��Cý���Sѓ���x�|S��y ��g컒�����x��?q������C��5�eW~���p��dV���o=�!kSZα$`�����=9�W;�q��ll��(;��Ƞ�SnIp��];b��,t�a��\5�Z(��r�<�k�^f;yS�k�E�G�ua!�>&����){�Rg�Z0���Z�����s�zv�*�e�S	`���Ÿ�d�<b����{m�l���w"l�i"ne������q�N�L��*AT��q	H�`�n.�1	�/w�-D�%�OA�s��>�E��Zp�o2���\>;@�5d���8d���8�(=0�^g��7SA�h_�%���؝]HWّ��>W���e��G�s]������f+g��s�b�BX3����5�Eɵ� �2������#��rm�C�%��6C�J�p�%��[qR�����\w��f�&=S��_�+�	9�Svy�lr]���E��-^�Z"<�8��o�b��L��~i{�9�|h���?l�)�VT+p&��
��\�Z1pn8?�͜��?�g��rիI�<Y7"M��ξY�N��֔mɕ[ �^x��+D��%PxE@��Ы�T�1��򆹖�W���a��v'��C�׼��;Y�Xd��@�`�
ko�PmP���d��̴N<���Ǥ�y�s��V����x��\X(X�m507?ح�8�r4�"�h��������� MKf�"rDо�����G+�n��KrS�}��uc�����$�Rh�������Rc4��UY�f�o�:�l|z�{�k���2q�Fk/�FK��P%Q�.[ג&�^+Z��Rc٧��R�'Ct��u�'��tk"Ȭ[�9��%4f�������Y��`�*.<�c�,���� �4����l�q�Ў���hg�<���nQp�8[]�F�a�L8d� C;;��m�5�Mtܫ��V���o�m�A�5e�jX�j��RfC�:�O�Ï�z=b�^f��ɕ�o_��,��ｉ��H�(m3\��Wm(�x�e��ų�X�z��5�Hzt��Y<�_44��?���{����+��p���Y�$�:�@�@O���8s�7N����K����e��>5���x�0>&3��x��B&ѣ�.dP�`�{�zZ���v�)/����έ�خ���^`��R8X\�Ԡ1������$�`NR��tp�@]I\��Y��
��u7��u�};w���^�;��Θ[%�����9����,���5Ωf      F     x���KR�HE�ϫ`��?3����w�K��P=�"��(|��JIWr���x%�)�Z��h٩�흫���4"hj��[2��FI�� mf���%���FqQ���V��ܒ?$}c}H��5�����l�"=-[��m��.�n��Ll�.K��6�D��g��O�`�'�-��Q���벚Z�wvOMԠ�k��=��p�/����Cp=j�n<Z��'>D��):-��w���Wh��,;���R3+�U�r̕�i���\����|.t���U���K�r�Ȧ�=�9啪���CT�Z�x�ol�^UW�/�}� /e��4��GKm�����X��z���%t��<�?%?�-;����S�h��%Om�%���qi�4PnF^��Jn�Fe�6n.�:���|+��Z�qW������o9�o���|D��R��;��P����D�mT+��<�0�����9ՙ]��=��/׳ժ��(�[�Ss�;��HV�-ݩ�Xi��F�W-���Y%s�S�Rk�Qg�4�6����c��N����L�����S�TO�r��Ϥ�������FҐI�ɾ_����r>Y��?�_�\�����G��J�Vz�\F�6�_��o(J���K&��A�nkɷ�D�ogo=�Gǀ��
���%�D>�
����u;�%+�S����yD�4�����.���İ�,O�)�cVb�������S����U����ow��<Պf}�J�a~`z��x^����C�f�u�?ҊV.�?؟�dX̚��u�	N�.�I�ᓵ�R
~����bđ�o����w	��E��5c��Im�>�j�M,S�_��'ٙ�J)�����PxH(0d�j��Z��K�(�>�����.�S�9��_IӸ(����efb�!�\�r�x��=��`�������Ubg[�0V�D�a�����H�"�ꯎ�w���"��3�C�G׎�8s*��)�zA��"X����*�E�t�*hqT�w8������7kM�/,pm��vW�ż�`�Ps
�k0�9:xkZU�.X�E��3��X����a�6�1��a1��׉oH;<wy�uDN=��O�+ߣ+&ڥG۹>�171��iŞ�� a�Ot��a�n8�^�ȭ0�]��F�~u�~���Ȟ�����z�
�JX�����7���fL��L�=�`czf"._#�v����1gF�������[����l
��Q�J�����*�3�]r9B֜-&�)��8�-}�)�{������=3I�m�&A�oJ���c�>����s��/2�O&      G   )  x��T��1�w�p�ǟ(ijq"�b�%��w�����b�@ �벍D�&�t�@0������j}4�LԽ��0�7>�Cc�-�*#A�Y���|P���h��Ĵ �!P�g/Y�6ꃑ�~�p�$w������<���^;�@�N+�6�6����)h��z���p_���nM�~�ZY5+��k2���14�؏��D�)���8���F�����Y�>q����l@x*^����['��x��H�$��4N1Ũԗ#�X�Y��W�7�5��^]��y�I��(�T�Yp$�D%��{����>�s��t�T�|���^<9�߲��٭�)�oY��y��Uک*���uJ�i1}�N���.��c�ROi�"�`���Fy��oY�-x#=i�[�x^�����Vo�0���3d�����(m@�]�� �9��JG�&[,!+������q˞�oYTm�<���7��8�m��tTë�ǫ��.L�6�&qj�BZ)_�.T�=�SW16��D�7u���>�޷�����?�J�      H   
  x��Z[n9�n��`���}�=����,�c��l�ت�6 �����VU8+�,��˩J��$�ڬ-��G��U�/�z�\4dJ5Hk��|d�I1�!���«�)�ϙ�s�ShES�OՈˍ^��.$1%}KV�sΉ��?�_�B�$���Lz�vS��������_���J�-�Ҁ�r�}�۞f�������߈M]�S�����	���n�\q�K��y)�ڤ�VYVB�:�C5��h�i�ś����sYA欸l#`H%���#]�o���-��_cf�E���a�k�Y^�ʸ͚���h]�}p+L��1�s��d�F�R�d�����,b��^0�n�nɮ%�Ô%9%�]u#)�*��%gY�u���/.g�lY�\_M�ܤ�4]��>�f�4�R��1�M�S	�U�r"Jr�����xqp�8��gL7�����ǜbZ�x�y8�M [4�ɋFԳ礙|SY��B,z�x�|$��\��R2h%D\1tJq
n_����YA�q�'bl�1߄�BG̽N��h@R�?�Dh���#�<��|��_�\�A>��:��rM��g�T��A%1j�_�F��}mU<qy#�,@M���O�Z�-q�0�G� �B�����?S$.C�g:�J�B�3,��I0��x9J�퍇��皘dpHrY+��F��G�m>�����=�˳��O� 2t�� �f_�R�� �m����m�q�c;����X��Y�#�Onj�|$�f��we�crn�Y�&]kL=�pl�6 	�W^"7�#�9?̹�5<��X}g9D��i�a�$̪�q���˔!�2��5F9zv�	32۷�P���@�8���5g&��b�-���]sLG��>@���W	�.$����)v�s�%B�I��`֌�|��<�A��!"؉��c��J���<���b�_��A��9�ɍ#2��?F#�Qx�kU���J(ߖQ�8"���<�s�-u�i'�׃هp[$~�7jE��D�7q
� ��q�������Q�Q!�Ř��K�;��+r�1�/�2%�g܌��ISMs����,� ��Y�a�O� ��x#���n����B�� �u�����A��oֺ_S�e��"�/[ �+���SN�ԧQ����O���0�|g�uVsEfF6BΏ^���1h��<��]� ׇ�2�:O�PMJ����y�F�c�E��P���m�&��h$�^� >%�Ђ�a�G�H�!���� �MF(���/!�:hqD�$5�Ҍ�)8s #%�R[�8l��s�����D��z�8э��Jk�f���d՝���P�q��V�f7�=d�0��J|)� m����O_QjI2$�B���*�HS�o�����:V5�i�b$��c���K���s����j<SO����D�N��b�*+�=��2xFmW@C_��U�BY�$�$��6�z�b��5�13�B*@ �wt�WGLT���޾��6s� d�s&{\f��)?]�R/�q�	��q�е�78��g,���s�4���T�0Ӌo�v��P�g�if���_�#��)H� E3��o?W�)����^j9#7�2m���cF�ʎ�k۫_ F�`�f�'�G��[�)�� J�!Í�^F����<{�Tp=��{n��3�N����a���T�^���ڸ��ڻ�4��ٶ��Z����F�|��N�k�h�p�m�)�g��f�ܑ���)�'(�l��%���ڃ^��
Wg٥���,_���b����2���8G�R�
3�¶*���ǂ�ȉ�'�!pk�!�eO?�4gH�N��;�;b�G"�c�_1��~�=e߄�K��u���o��B��,����y�d佘��ƈʑD�7�-޷\ރGh����S��MF~�}^"�#�c�xG����xD���o���"��F�D�e����8"rfܤdy\1�#��!x2��k��&�-D�I���K�6OOB�v�,���y[��jzl�^Z�s��t/I���m�ey����/��ʨ{��_��|c�_Т�Y�ג[E�~�Pq��[��MWk%�����0�:����p��s����t��wphdM=�e>Nb�%Tp����7����d�]��kzV�;f�7�k�0��+��Ǹ_Q³!��nA�~���(3t5�02P�^h��Fb9z	�͈w�7��X9ؘ�r5���-�k���E���>�������e�t�Y�9���Z'ʊn���z��z"`%b�s��?S��`ߗ����d��p�x棔��`(��&[{�r1�!���/?��2���k����:5,Vxɀ�U�FMѨ|����/Z��,� �����u��QY��,���`-n�}�F�?��>�J�׌�`������+���w�/ŐE�,Tt1��ܢ**`���Z��l�"jF��<g\Y��0g��`�`Ҫc����������r7$E����ʡ�iڛ�cΘ:��Wg)#�q��e�;E���*�~~���)�[�l��w� �^}K��9����Ǐ�/��      M   Z   x����0�����H�����/��H�ep�V���MZ�i�AS�(�倶����7�o�!$,�yR<�ыIm��]c��T�      I   �   x��ϻq�0E�xU���@��l"��	Vd;Tz�3��v[�*|�f��JmV�%���A�n�Ҷ�Rd��,��l�#%0���lWea��� ��ʴn�1�����7o�?�������PD��!>�E��Ť��볣���9�?­w�˙��wHb v*�,���|Nhf���ο��"]�RWV?��q?(V`$      J      x������ � �      K   �  x�՘�n��׭� ����\��@��E8H�������83�\h�AVA�y� r�쳍�d�����(�tF��!9�&�]_����TM!����d�4٤k��	.�b���]�͢-j�v�~[7�<�?>_��Ů�e�_�:_r���XM��cK:,&s
!8]z�}�m4��::�k��tZ�...N��S�����7��qq����qS��ץ�U���b��,�����f}�X�z7��������rw{��u���r;�f����/���z���`� ���UY/�tlPH�����Q��^�	����� س��� ?����វ/�<{�Kdm��T�U�d���(7�'��i�[ڻ��}<~��zy����B����7�\L<>����}/���a�>`�>���IiS�
�Fe#P{�y��t�|�Z��}������]����[�tmjʞ��`J'f��Q(��d}�"�eZ_��&^��.��	\��'��6�8�J�Т!瘽a�'&�L�l��J����+�N?��|z���d���f
p��A�Boz�7���F9�(��GI"��U��j���c���Hm���������q^lQm����.�y��l���u���i�b�]d$�]�1��g5ț�k(V�d�,@��h�m�]��32]�������3�|�,�����YAWy@������� FU���bQr/��`���E���>��t����㍊̤�@p�4���e�����I�+[��vz;��D����D�,����m����΋�j��O�'�V����'3�{�yJЉA�]\Qp[ZT�5���H��&�y��LA4N�*�Q����+��]�a���3O�=)k�U�K�4���X���U�B��˗t����j�jѝ��~��Nz"g��m�	%n<̹��#�&H�JҬQ!�w���nʗ���w�Ϳ�ww����#z&ya�;������$J��c��.{%11[�5��4���߿�n}{�ckS%��%J�2�	y�<�H�:	J��S�H����dcn��`^���؝�w7��k�}6��z���T
դ�'F��hcÔ����ZSRG��(��$?	�5W���y���N���z�!�4�A�@<��у��äSp�"�ͨ����8t0Ei͈�U��9 ��x��^��o�~|��Mg�IB_fl�&�PxT�ėʨꤒM^�L�5K�^}�_�?�"qOz8YQw��O/$Y���5r�+I�/[)[�C-��tp!&�z@G��t��W���}k�н����6NL�vxc��1t��d~?�w�vl�QEY-H����6Дb�N��R�{�b[��:`�t���ƈ�_�J��͍��!�lmi���1`�Qf�ˑ%�iĝ�xС���oL�����W�F�,�Fx�A��э]����%��{��O9������د�u>L��Ez���J�WAI� ���\�M-P��%��
ҋ����~=�~0m�$�����=1M����ٳg�!     