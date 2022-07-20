--
-- PostgreSQL database dump
--

-- Dumped from database version 14.2
-- Dumped by pg_dump version 14.2 (Ubuntu 14.2-1.pgdg20.04+1+b1)

-- Started on 2022-06-08 08:58:57 +07

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 2 (class 3079 OID 18643)
-- Name: pg_stat_statements; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_stat_statements WITH SCHEMA public;


--
-- TOC entry 4156 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION pg_stat_statements; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_stat_statements IS 'track planning and execution statistics of all SQL statements executed';


--
-- TOC entry 3 (class 3079 OID 18668)
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- TOC entry 4157 (class 0 OID 0)
-- Dependencies: 3
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- TOC entry 358 (class 1255 OID 20440)
-- Name: accounts_after_insert_row_tr(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.accounts_after_insert_row_tr() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    execute format('create sequence IF NOT EXISTS conv_dpid_seq_%s', NEW.id);
    RETURN NULL;
END;
$$;


ALTER FUNCTION public.accounts_after_insert_row_tr() OWNER TO postgres;

--
-- TOC entry 360 (class 1255 OID 20444)
-- Name: camp_dpid_before_insert(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.camp_dpid_before_insert() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    execute format('create sequence IF NOT EXISTS camp_dpid_seq_%s', NEW.id);
    RETURN NULL;
END;
$$;


ALTER FUNCTION public.camp_dpid_before_insert() OWNER TO postgres;

--
-- TOC entry 361 (class 1255 OID 20446)
-- Name: campaigns_before_insert_row_tr(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.campaigns_before_insert_row_tr() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.display_id := nextval('camp_dpid_seq_' || NEW.account_id);
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.campaigns_before_insert_row_tr() OWNER TO postgres;

--
-- TOC entry 359 (class 1255 OID 20442)
-- Name: conversations_before_insert_row_tr(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.conversations_before_insert_row_tr() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.display_id := nextval('conv_dpid_seq_' || NEW.account_id);
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.conversations_before_insert_row_tr() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 216 (class 1259 OID 19587)
-- Name: access_tokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.access_tokens (
    id bigint NOT NULL,
    owner_type character varying,
    owner_id bigint,
    token character varying,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.access_tokens OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 19586)
-- Name: access_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.access_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.access_tokens_id_seq OWNER TO postgres;

--
-- TOC entry 4158 (class 0 OID 0)
-- Dependencies: 215
-- Name: access_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.access_tokens_id_seq OWNED BY public.access_tokens.id;


--
-- TOC entry 218 (class 1259 OID 19598)
-- Name: account_users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.account_users (
    id bigint NOT NULL,
    account_id bigint,
    user_id bigint,
    role integer DEFAULT 0,
    inviter_id bigint,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    active_at timestamp without time zone,
    availability integer DEFAULT 0 NOT NULL,
    auto_offline boolean DEFAULT true NOT NULL
);


ALTER TABLE public.account_users OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 19597)
-- Name: account_users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.account_users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.account_users_id_seq OWNER TO postgres;

--
-- TOC entry 4159 (class 0 OID 0)
-- Dependencies: 217
-- Name: account_users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.account_users_id_seq OWNED BY public.account_users.id;


--
-- TOC entry 220 (class 1259 OID 19611)
-- Name: accounts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.accounts (
    id integer NOT NULL,
    name character varying NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    locale integer DEFAULT 0,
    domain character varying(100),
    support_email character varying(100),
    settings_flags integer DEFAULT 0 NOT NULL,
    feature_flags integer DEFAULT 0 NOT NULL,
    auto_resolve_duration integer,
    limits jsonb DEFAULT '{}'::jsonb
);


ALTER TABLE public.accounts OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 19610)
-- Name: accounts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.accounts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.accounts_id_seq OWNER TO postgres;

--
-- TOC entry 4160 (class 0 OID 0)
-- Dependencies: 219
-- Name: accounts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.accounts_id_seq OWNED BY public.accounts.id;


--
-- TOC entry 222 (class 1259 OID 19624)
-- Name: action_mailbox_inbound_emails; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.action_mailbox_inbound_emails (
    id bigint NOT NULL,
    status integer DEFAULT 0 NOT NULL,
    message_id character varying NOT NULL,
    message_checksum character varying NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.action_mailbox_inbound_emails OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 19623)
-- Name: action_mailbox_inbound_emails_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.action_mailbox_inbound_emails_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.action_mailbox_inbound_emails_id_seq OWNER TO postgres;

--
-- TOC entry 4161 (class 0 OID 0)
-- Dependencies: 221
-- Name: action_mailbox_inbound_emails_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.action_mailbox_inbound_emails_id_seq OWNED BY public.action_mailbox_inbound_emails.id;


--
-- TOC entry 224 (class 1259 OID 19635)
-- Name: active_storage_attachments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.active_storage_attachments (
    id bigint NOT NULL,
    name character varying NOT NULL,
    record_type character varying NOT NULL,
    record_id bigint NOT NULL,
    blob_id bigint NOT NULL,
    created_at timestamp without time zone NOT NULL
);


ALTER TABLE public.active_storage_attachments OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 19634)
-- Name: active_storage_attachments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.active_storage_attachments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.active_storage_attachments_id_seq OWNER TO postgres;

--
-- TOC entry 4162 (class 0 OID 0)
-- Dependencies: 223
-- Name: active_storage_attachments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.active_storage_attachments_id_seq OWNED BY public.active_storage_attachments.id;


--
-- TOC entry 226 (class 1259 OID 19646)
-- Name: active_storage_blobs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.active_storage_blobs (
    id bigint NOT NULL,
    key character varying NOT NULL,
    filename character varying NOT NULL,
    content_type character varying,
    metadata text,
    byte_size bigint NOT NULL,
    checksum character varying NOT NULL,
    created_at timestamp without time zone NOT NULL,
    service_name character varying NOT NULL
);


ALTER TABLE public.active_storage_blobs OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 19645)
-- Name: active_storage_blobs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.active_storage_blobs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.active_storage_blobs_id_seq OWNER TO postgres;

--
-- TOC entry 4163 (class 0 OID 0)
-- Dependencies: 225
-- Name: active_storage_blobs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.active_storage_blobs_id_seq OWNED BY public.active_storage_blobs.id;


--
-- TOC entry 228 (class 1259 OID 19656)
-- Name: active_storage_variant_records; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.active_storage_variant_records (
    id bigint NOT NULL,
    blob_id bigint NOT NULL,
    variation_digest character varying NOT NULL
);


ALTER TABLE public.active_storage_variant_records OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 19655)
-- Name: active_storage_variant_records_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.active_storage_variant_records_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.active_storage_variant_records_id_seq OWNER TO postgres;

--
-- TOC entry 4164 (class 0 OID 0)
-- Dependencies: 227
-- Name: active_storage_variant_records_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.active_storage_variant_records_id_seq OWNED BY public.active_storage_variant_records.id;


--
-- TOC entry 230 (class 1259 OID 19666)
-- Name: agent_bot_inboxes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.agent_bot_inboxes (
    id bigint NOT NULL,
    inbox_id integer,
    agent_bot_id integer,
    status integer DEFAULT 0,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    account_id integer
);


ALTER TABLE public.agent_bot_inboxes OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 19665)
-- Name: agent_bot_inboxes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.agent_bot_inboxes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.agent_bot_inboxes_id_seq OWNER TO postgres;

--
-- TOC entry 4165 (class 0 OID 0)
-- Dependencies: 229
-- Name: agent_bot_inboxes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.agent_bot_inboxes_id_seq OWNED BY public.agent_bot_inboxes.id;


--
-- TOC entry 232 (class 1259 OID 19674)
-- Name: agent_bots; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.agent_bots (
    id bigint NOT NULL,
    name character varying,
    description character varying,
    outgoing_url character varying,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    account_id bigint
);


ALTER TABLE public.agent_bots OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 19673)
-- Name: agent_bots_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.agent_bots_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.agent_bots_id_seq OWNER TO postgres;

--
-- TOC entry 4166 (class 0 OID 0)
-- Dependencies: 231
-- Name: agent_bots_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.agent_bots_id_seq OWNED BY public.agent_bots.id;


--
-- TOC entry 330 (class 1259 OID 20455)
-- Name: ar_internal_metadata; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ar_internal_metadata (
    key character varying NOT NULL,
    value character varying,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.ar_internal_metadata OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 19684)
-- Name: attachments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.attachments (
    id integer NOT NULL,
    file_type integer DEFAULT 0,
    external_url character varying,
    coordinates_lat double precision DEFAULT 0.0,
    coordinates_long double precision DEFAULT 0.0,
    message_id integer NOT NULL,
    account_id integer NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    fallback_title character varying,
    extension character varying
);


ALTER TABLE public.attachments OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 19683)
-- Name: attachments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.attachments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.attachments_id_seq OWNER TO postgres;

--
-- TOC entry 4167 (class 0 OID 0)
-- Dependencies: 233
-- Name: attachments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.attachments_id_seq OWNED BY public.attachments.id;


--
-- TOC entry 236 (class 1259 OID 19696)
-- Name: automation_rules; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.automation_rules (
    id bigint NOT NULL,
    account_id bigint NOT NULL,
    name character varying NOT NULL,
    description text,
    event_name character varying NOT NULL,
    conditions jsonb DEFAULT '"{}"'::jsonb NOT NULL,
    actions jsonb DEFAULT '"{}"'::jsonb NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    active boolean DEFAULT true NOT NULL
);


ALTER TABLE public.automation_rules OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 19695)
-- Name: automation_rules_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.automation_rules_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.automation_rules_id_seq OWNER TO postgres;

--
-- TOC entry 4168 (class 0 OID 0)
-- Dependencies: 235
-- Name: automation_rules_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.automation_rules_id_seq OWNED BY public.automation_rules.id;


--
-- TOC entry 214 (class 1259 OID 19584)
-- Name: camp_dpid_seq_1; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.camp_dpid_seq_1
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.camp_dpid_seq_1 OWNER TO postgres;

--
-- TOC entry 238 (class 1259 OID 19709)
-- Name: campaigns; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.campaigns (
    id bigint NOT NULL,
    display_id integer NOT NULL,
    title character varying NOT NULL,
    description text,
    message text NOT NULL,
    sender_id integer,
    enabled boolean DEFAULT true,
    account_id bigint NOT NULL,
    inbox_id bigint NOT NULL,
    trigger_rules jsonb DEFAULT '{}'::jsonb,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    campaign_type integer DEFAULT 0 NOT NULL,
    campaign_status integer DEFAULT 0 NOT NULL,
    audience jsonb DEFAULT '[]'::jsonb,
    scheduled_at timestamp without time zone,
    trigger_only_during_business_hours boolean DEFAULT false
);


ALTER TABLE public.campaigns OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 19708)
-- Name: campaigns_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.campaigns_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.campaigns_id_seq OWNER TO postgres;

--
-- TOC entry 4169 (class 0 OID 0)
-- Dependencies: 237
-- Name: campaigns_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.campaigns_id_seq OWNED BY public.campaigns.id;


--
-- TOC entry 240 (class 1259 OID 19729)
-- Name: canned_responses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.canned_responses (
    id integer NOT NULL,
    account_id integer NOT NULL,
    short_code character varying,
    content text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.canned_responses OWNER TO postgres;

--
-- TOC entry 239 (class 1259 OID 19728)
-- Name: canned_responses_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.canned_responses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.canned_responses_id_seq OWNER TO postgres;

--
-- TOC entry 4170 (class 0 OID 0)
-- Dependencies: 239
-- Name: canned_responses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.canned_responses_id_seq OWNED BY public.canned_responses.id;


--
-- TOC entry 242 (class 1259 OID 19738)
-- Name: channel_api; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.channel_api (
    id bigint NOT NULL,
    account_id integer NOT NULL,
    webhook_url character varying,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    identifier character varying,
    hmac_token character varying,
    hmac_mandatory boolean DEFAULT false
);


ALTER TABLE public.channel_api OWNER TO postgres;

--
-- TOC entry 241 (class 1259 OID 19737)
-- Name: channel_api_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.channel_api_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.channel_api_id_seq OWNER TO postgres;

--
-- TOC entry 4171 (class 0 OID 0)
-- Dependencies: 241
-- Name: channel_api_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.channel_api_id_seq OWNED BY public.channel_api.id;


--
-- TOC entry 244 (class 1259 OID 19750)
-- Name: channel_email; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.channel_email (
    id bigint NOT NULL,
    account_id integer NOT NULL,
    email character varying NOT NULL,
    forward_to_email character varying NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    imap_enabled boolean DEFAULT false,
    imap_address character varying DEFAULT ''::character varying,
    imap_port integer DEFAULT 0,
    imap_login character varying DEFAULT ''::character varying,
    imap_password character varying DEFAULT ''::character varying,
    imap_enable_ssl boolean DEFAULT true,
    imap_inbox_synced_at timestamp without time zone,
    smtp_enabled boolean DEFAULT false,
    smtp_address character varying DEFAULT ''::character varying,
    smtp_port integer DEFAULT 0,
    smtp_login character varying DEFAULT ''::character varying,
    smtp_password character varying DEFAULT ''::character varying,
    smtp_domain character varying DEFAULT ''::character varying,
    smtp_enable_starttls_auto boolean DEFAULT true,
    smtp_authentication character varying DEFAULT 'login'::character varying,
    smtp_openssl_verify_mode character varying DEFAULT 'none'::character varying,
    smtp_enable_ssl_tls boolean DEFAULT false
);


ALTER TABLE public.channel_email OWNER TO postgres;

--
-- TOC entry 243 (class 1259 OID 19749)
-- Name: channel_email_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.channel_email_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.channel_email_id_seq OWNER TO postgres;

--
-- TOC entry 4172 (class 0 OID 0)
-- Dependencies: 243
-- Name: channel_email_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.channel_email_id_seq OWNED BY public.channel_email.id;


--
-- TOC entry 246 (class 1259 OID 19777)
-- Name: channel_facebook_pages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.channel_facebook_pages (
    id integer NOT NULL,
    page_id character varying NOT NULL,
    user_access_token character varying NOT NULL,
    page_access_token character varying NOT NULL,
    account_id integer NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    instagram_id character varying
);


ALTER TABLE public.channel_facebook_pages OWNER TO postgres;

--
-- TOC entry 245 (class 1259 OID 19776)
-- Name: channel_facebook_pages_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.channel_facebook_pages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.channel_facebook_pages_id_seq OWNER TO postgres;

--
-- TOC entry 4173 (class 0 OID 0)
-- Dependencies: 245
-- Name: channel_facebook_pages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.channel_facebook_pages_id_seq OWNED BY public.channel_facebook_pages.id;


--
-- TOC entry 248 (class 1259 OID 19788)
-- Name: channel_line; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.channel_line (
    id bigint NOT NULL,
    account_id integer NOT NULL,
    line_channel_id character varying NOT NULL,
    line_channel_secret character varying NOT NULL,
    line_channel_token character varying NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.channel_line OWNER TO postgres;

--
-- TOC entry 247 (class 1259 OID 19787)
-- Name: channel_line_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.channel_line_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.channel_line_id_seq OWNER TO postgres;

--
-- TOC entry 4174 (class 0 OID 0)
-- Dependencies: 247
-- Name: channel_line_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.channel_line_id_seq OWNED BY public.channel_line.id;


--
-- TOC entry 250 (class 1259 OID 19798)
-- Name: channel_sms; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.channel_sms (
    id bigint NOT NULL,
    account_id integer NOT NULL,
    phone_number character varying NOT NULL,
    provider character varying DEFAULT 'default'::character varying,
    provider_config jsonb DEFAULT '{}'::jsonb,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.channel_sms OWNER TO postgres;

--
-- TOC entry 249 (class 1259 OID 19797)
-- Name: channel_sms_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.channel_sms_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.channel_sms_id_seq OWNER TO postgres;

--
-- TOC entry 4175 (class 0 OID 0)
-- Dependencies: 249
-- Name: channel_sms_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.channel_sms_id_seq OWNED BY public.channel_sms.id;


--
-- TOC entry 252 (class 1259 OID 19810)
-- Name: channel_telegram; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.channel_telegram (
    id bigint NOT NULL,
    bot_name character varying,
    account_id integer NOT NULL,
    bot_token character varying NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.channel_telegram OWNER TO postgres;

--
-- TOC entry 251 (class 1259 OID 19809)
-- Name: channel_telegram_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.channel_telegram_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.channel_telegram_id_seq OWNER TO postgres;

--
-- TOC entry 4176 (class 0 OID 0)
-- Dependencies: 251
-- Name: channel_telegram_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.channel_telegram_id_seq OWNED BY public.channel_telegram.id;


--
-- TOC entry 254 (class 1259 OID 19820)
-- Name: channel_twilio_sms; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.channel_twilio_sms (
    id bigint NOT NULL,
    phone_number character varying NOT NULL,
    auth_token character varying NOT NULL,
    account_sid character varying NOT NULL,
    account_id integer NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    medium integer DEFAULT 0
);


ALTER TABLE public.channel_twilio_sms OWNER TO postgres;

--
-- TOC entry 253 (class 1259 OID 19819)
-- Name: channel_twilio_sms_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.channel_twilio_sms_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.channel_twilio_sms_id_seq OWNER TO postgres;

--
-- TOC entry 4177 (class 0 OID 0)
-- Dependencies: 253
-- Name: channel_twilio_sms_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.channel_twilio_sms_id_seq OWNED BY public.channel_twilio_sms.id;


--
-- TOC entry 256 (class 1259 OID 19832)
-- Name: channel_twitter_profiles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.channel_twitter_profiles (
    id bigint NOT NULL,
    profile_id character varying NOT NULL,
    twitter_access_token character varying NOT NULL,
    twitter_access_token_secret character varying NOT NULL,
    account_id integer NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    tweets_enabled boolean DEFAULT true
);


ALTER TABLE public.channel_twitter_profiles OWNER TO postgres;

--
-- TOC entry 255 (class 1259 OID 19831)
-- Name: channel_twitter_profiles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.channel_twitter_profiles_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.channel_twitter_profiles_id_seq OWNER TO postgres;

--
-- TOC entry 4178 (class 0 OID 0)
-- Dependencies: 255
-- Name: channel_twitter_profiles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.channel_twitter_profiles_id_seq OWNED BY public.channel_twitter_profiles.id;


--
-- TOC entry 258 (class 1259 OID 19843)
-- Name: channel_web_widgets; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.channel_web_widgets (
    id integer NOT NULL,
    website_url character varying,
    account_id integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    website_token character varying,
    widget_color character varying DEFAULT '#1f93ff'::character varying,
    welcome_title character varying,
    welcome_tagline character varying,
    feature_flags integer DEFAULT 7 NOT NULL,
    reply_time integer DEFAULT 0,
    hmac_token character varying,
    pre_chat_form_enabled boolean DEFAULT false,
    pre_chat_form_options jsonb DEFAULT '{}'::jsonb,
    hmac_mandatory boolean DEFAULT false,
    continuity_via_email boolean DEFAULT true NOT NULL
);


ALTER TABLE public.channel_web_widgets OWNER TO postgres;

--
-- TOC entry 257 (class 1259 OID 19842)
-- Name: channel_web_widgets_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.channel_web_widgets_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.channel_web_widgets_id_seq OWNER TO postgres;

--
-- TOC entry 4179 (class 0 OID 0)
-- Dependencies: 257
-- Name: channel_web_widgets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.channel_web_widgets_id_seq OWNED BY public.channel_web_widgets.id;


--
-- TOC entry 260 (class 1259 OID 19861)
-- Name: channel_whatsapp; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.channel_whatsapp (
    id bigint NOT NULL,
    account_id integer NOT NULL,
    phone_number character varying NOT NULL,
    provider character varying DEFAULT 'default'::character varying,
    provider_config jsonb DEFAULT '{}'::jsonb,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    message_templates jsonb DEFAULT '{}'::jsonb,
    message_templates_last_updated timestamp without time zone
);


ALTER TABLE public.channel_whatsapp OWNER TO postgres;

--
-- TOC entry 259 (class 1259 OID 19860)
-- Name: channel_whatsapp_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.channel_whatsapp_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.channel_whatsapp_id_seq OWNER TO postgres;

--
-- TOC entry 4180 (class 0 OID 0)
-- Dependencies: 259
-- Name: channel_whatsapp_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.channel_whatsapp_id_seq OWNED BY public.channel_whatsapp.id;


--
-- TOC entry 262 (class 1259 OID 19874)
-- Name: contact_inboxes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contact_inboxes (
    id bigint NOT NULL,
    contact_id bigint,
    inbox_id bigint,
    source_id character varying NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    hmac_verified boolean DEFAULT false,
    pubsub_token character varying
);


ALTER TABLE public.contact_inboxes OWNER TO postgres;

--
-- TOC entry 261 (class 1259 OID 19873)
-- Name: contact_inboxes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.contact_inboxes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.contact_inboxes_id_seq OWNER TO postgres;

--
-- TOC entry 4181 (class 0 OID 0)
-- Dependencies: 261
-- Name: contact_inboxes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.contact_inboxes_id_seq OWNED BY public.contact_inboxes.id;


--
-- TOC entry 264 (class 1259 OID 19889)
-- Name: contacts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contacts (
    id integer NOT NULL,
    name character varying,
    email character varying,
    phone_number character varying,
    account_id integer NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    additional_attributes jsonb DEFAULT '{}'::jsonb,
    identifier character varying,
    custom_attributes jsonb DEFAULT '{}'::jsonb,
    last_activity_at timestamp without time zone
);


ALTER TABLE public.contacts OWNER TO postgres;

--
-- TOC entry 263 (class 1259 OID 19888)
-- Name: contacts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.contacts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.contacts_id_seq OWNER TO postgres;

--
-- TOC entry 4182 (class 0 OID 0)
-- Dependencies: 263
-- Name: contacts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.contacts_id_seq OWNED BY public.contacts.id;


--
-- TOC entry 213 (class 1259 OID 19583)
-- Name: conv_dpid_seq_1; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.conv_dpid_seq_1
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.conv_dpid_seq_1 OWNER TO postgres;

--
-- TOC entry 266 (class 1259 OID 19904)
-- Name: conversations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.conversations (
    id integer NOT NULL,
    account_id integer NOT NULL,
    inbox_id integer NOT NULL,
    status integer DEFAULT 0 NOT NULL,
    assignee_id integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    contact_id bigint,
    display_id integer NOT NULL,
    contact_last_seen_at timestamp without time zone,
    agent_last_seen_at timestamp without time zone,
    additional_attributes jsonb DEFAULT '{}'::jsonb,
    contact_inbox_id bigint,
    uuid uuid DEFAULT public.gen_random_uuid() NOT NULL,
    identifier character varying,
    last_activity_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    team_id bigint,
    campaign_id bigint,
    snoozed_until timestamp without time zone,
    custom_attributes jsonb DEFAULT '{}'::jsonb,
    assignee_last_seen_at timestamp without time zone
);


ALTER TABLE public.conversations OWNER TO postgres;

--
-- TOC entry 265 (class 1259 OID 19903)
-- Name: conversations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.conversations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.conversations_id_seq OWNER TO postgres;

--
-- TOC entry 4183 (class 0 OID 0)
-- Dependencies: 265
-- Name: conversations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.conversations_id_seq OWNED BY public.conversations.id;


--
-- TOC entry 268 (class 1259 OID 19926)
-- Name: csat_survey_responses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.csat_survey_responses (
    id bigint NOT NULL,
    account_id bigint NOT NULL,
    conversation_id bigint NOT NULL,
    message_id bigint NOT NULL,
    rating integer NOT NULL,
    feedback_message text,
    contact_id bigint NOT NULL,
    assigned_agent_id bigint,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.csat_survey_responses OWNER TO postgres;

--
-- TOC entry 267 (class 1259 OID 19925)
-- Name: csat_survey_responses_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.csat_survey_responses_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.csat_survey_responses_id_seq OWNER TO postgres;

--
-- TOC entry 4184 (class 0 OID 0)
-- Dependencies: 267
-- Name: csat_survey_responses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.csat_survey_responses_id_seq OWNED BY public.csat_survey_responses.id;


--
-- TOC entry 270 (class 1259 OID 19940)
-- Name: custom_attribute_definitions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.custom_attribute_definitions (
    id bigint NOT NULL,
    attribute_display_name character varying,
    attribute_key character varying,
    attribute_display_type integer DEFAULT 0,
    default_value integer,
    attribute_model integer DEFAULT 0,
    account_id bigint,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    attribute_description text,
    attribute_values jsonb DEFAULT '[]'::jsonb
);


ALTER TABLE public.custom_attribute_definitions OWNER TO postgres;

--
-- TOC entry 269 (class 1259 OID 19939)
-- Name: custom_attribute_definitions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.custom_attribute_definitions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.custom_attribute_definitions_id_seq OWNER TO postgres;

--
-- TOC entry 4185 (class 0 OID 0)
-- Dependencies: 269
-- Name: custom_attribute_definitions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.custom_attribute_definitions_id_seq OWNED BY public.custom_attribute_definitions.id;


--
-- TOC entry 272 (class 1259 OID 19954)
-- Name: custom_filters; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.custom_filters (
    id bigint NOT NULL,
    name character varying NOT NULL,
    filter_type integer DEFAULT 0 NOT NULL,
    query jsonb DEFAULT '"{}"'::jsonb NOT NULL,
    account_id bigint NOT NULL,
    user_id bigint NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.custom_filters OWNER TO postgres;

--
-- TOC entry 271 (class 1259 OID 19953)
-- Name: custom_filters_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.custom_filters_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.custom_filters_id_seq OWNER TO postgres;

--
-- TOC entry 4186 (class 0 OID 0)
-- Dependencies: 271
-- Name: custom_filters_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.custom_filters_id_seq OWNED BY public.custom_filters.id;


--
-- TOC entry 274 (class 1259 OID 19967)
-- Name: data_imports; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.data_imports (
    id bigint NOT NULL,
    account_id bigint NOT NULL,
    data_type character varying NOT NULL,
    status integer DEFAULT 0 NOT NULL,
    processing_errors text,
    total_records integer,
    processed_records integer,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.data_imports OWNER TO postgres;

--
-- TOC entry 273 (class 1259 OID 19966)
-- Name: data_imports_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.data_imports_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.data_imports_id_seq OWNER TO postgres;

--
-- TOC entry 4187 (class 0 OID 0)
-- Dependencies: 273
-- Name: data_imports_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.data_imports_id_seq OWNED BY public.data_imports.id;


--
-- TOC entry 276 (class 1259 OID 19978)
-- Name: email_templates; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.email_templates (
    id bigint NOT NULL,
    name character varying NOT NULL,
    body text NOT NULL,
    account_id integer,
    template_type integer DEFAULT 1,
    locale integer DEFAULT 0 NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.email_templates OWNER TO postgres;

--
-- TOC entry 275 (class 1259 OID 19977)
-- Name: email_templates_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.email_templates_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.email_templates_id_seq OWNER TO postgres;

--
-- TOC entry 4188 (class 0 OID 0)
-- Dependencies: 275
-- Name: email_templates_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.email_templates_id_seq OWNED BY public.email_templates.id;


--
-- TOC entry 278 (class 1259 OID 19990)
-- Name: inbox_members; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inbox_members (
    id integer NOT NULL,
    user_id integer NOT NULL,
    inbox_id integer NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.inbox_members OWNER TO postgres;

--
-- TOC entry 277 (class 1259 OID 19989)
-- Name: inbox_members_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.inbox_members_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.inbox_members_id_seq OWNER TO postgres;

--
-- TOC entry 4189 (class 0 OID 0)
-- Dependencies: 277
-- Name: inbox_members_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.inbox_members_id_seq OWNED BY public.inbox_members.id;


--
-- TOC entry 280 (class 1259 OID 19999)
-- Name: inboxes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inboxes (
    id integer NOT NULL,
    channel_id integer NOT NULL,
    account_id integer NOT NULL,
    name character varying NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    channel_type character varying,
    enable_auto_assignment boolean DEFAULT true,
    greeting_enabled boolean DEFAULT false,
    greeting_message character varying,
    email_address character varying,
    working_hours_enabled boolean DEFAULT false,
    out_of_office_message character varying,
    timezone character varying DEFAULT 'UTC'::character varying,
    enable_email_collect boolean DEFAULT true,
    csat_survey_enabled boolean DEFAULT false,
    allow_messages_after_resolved boolean DEFAULT true
);


ALTER TABLE public.inboxes OWNER TO postgres;

--
-- TOC entry 279 (class 1259 OID 19998)
-- Name: inboxes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.inboxes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.inboxes_id_seq OWNER TO postgres;

--
-- TOC entry 4190 (class 0 OID 0)
-- Dependencies: 279
-- Name: inboxes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.inboxes_id_seq OWNED BY public.inboxes.id;


--
-- TOC entry 282 (class 1259 OID 20016)
-- Name: installation_configs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.installation_configs (
    id bigint NOT NULL,
    name character varying NOT NULL,
    serialized_value jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    locked boolean DEFAULT true NOT NULL
);


ALTER TABLE public.installation_configs OWNER TO postgres;

--
-- TOC entry 281 (class 1259 OID 20015)
-- Name: installation_configs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.installation_configs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.installation_configs_id_seq OWNER TO postgres;

--
-- TOC entry 4191 (class 0 OID 0)
-- Dependencies: 281
-- Name: installation_configs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.installation_configs_id_seq OWNED BY public.installation_configs.id;


--
-- TOC entry 284 (class 1259 OID 20029)
-- Name: integrations_hooks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.integrations_hooks (
    id bigint NOT NULL,
    status integer DEFAULT 0,
    inbox_id integer,
    account_id integer,
    app_id character varying,
    hook_type integer DEFAULT 0,
    reference_id character varying,
    access_token character varying,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    settings jsonb DEFAULT '{}'::jsonb
);


ALTER TABLE public.integrations_hooks OWNER TO postgres;

--
-- TOC entry 283 (class 1259 OID 20028)
-- Name: integrations_hooks_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.integrations_hooks_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.integrations_hooks_id_seq OWNER TO postgres;

--
-- TOC entry 4192 (class 0 OID 0)
-- Dependencies: 283
-- Name: integrations_hooks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.integrations_hooks_id_seq OWNED BY public.integrations_hooks.id;


--
-- TOC entry 286 (class 1259 OID 20041)
-- Name: kbase_articles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.kbase_articles (
    id bigint NOT NULL,
    account_id integer NOT NULL,
    portal_id integer NOT NULL,
    category_id integer,
    folder_id integer,
    author_id integer,
    title character varying,
    description text,
    content text,
    status integer,
    views integer,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.kbase_articles OWNER TO postgres;

--
-- TOC entry 285 (class 1259 OID 20040)
-- Name: kbase_articles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.kbase_articles_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.kbase_articles_id_seq OWNER TO postgres;

--
-- TOC entry 4193 (class 0 OID 0)
-- Dependencies: 285
-- Name: kbase_articles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.kbase_articles_id_seq OWNED BY public.kbase_articles.id;


--
-- TOC entry 288 (class 1259 OID 20050)
-- Name: kbase_categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.kbase_categories (
    id bigint NOT NULL,
    account_id integer NOT NULL,
    portal_id integer NOT NULL,
    name character varying,
    description text,
    "position" integer,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    locale character varying DEFAULT 'en'::character varying
);


ALTER TABLE public.kbase_categories OWNER TO postgres;

--
-- TOC entry 287 (class 1259 OID 20049)
-- Name: kbase_categories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.kbase_categories_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.kbase_categories_id_seq OWNER TO postgres;

--
-- TOC entry 4194 (class 0 OID 0)
-- Dependencies: 287
-- Name: kbase_categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.kbase_categories_id_seq OWNED BY public.kbase_categories.id;


--
-- TOC entry 290 (class 1259 OID 20061)
-- Name: kbase_folders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.kbase_folders (
    id bigint NOT NULL,
    account_id integer NOT NULL,
    category_id integer NOT NULL,
    name character varying,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.kbase_folders OWNER TO postgres;

--
-- TOC entry 289 (class 1259 OID 20060)
-- Name: kbase_folders_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.kbase_folders_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.kbase_folders_id_seq OWNER TO postgres;

--
-- TOC entry 4195 (class 0 OID 0)
-- Dependencies: 289
-- Name: kbase_folders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.kbase_folders_id_seq OWNED BY public.kbase_folders.id;


--
-- TOC entry 292 (class 1259 OID 20070)
-- Name: kbase_portals; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.kbase_portals (
    id bigint NOT NULL,
    account_id integer NOT NULL,
    name character varying NOT NULL,
    slug character varying NOT NULL,
    custom_domain character varying,
    color character varying,
    homepage_link character varying,
    page_title character varying,
    header_text text,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    config jsonb DEFAULT '{"allowed_locales": ["en"]}'::jsonb
);


ALTER TABLE public.kbase_portals OWNER TO postgres;

--
-- TOC entry 291 (class 1259 OID 20069)
-- Name: kbase_portals_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.kbase_portals_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.kbase_portals_id_seq OWNER TO postgres;

--
-- TOC entry 4196 (class 0 OID 0)
-- Dependencies: 291
-- Name: kbase_portals_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.kbase_portals_id_seq OWNED BY public.kbase_portals.id;


--
-- TOC entry 294 (class 1259 OID 20081)
-- Name: labels; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.labels (
    id bigint NOT NULL,
    title character varying,
    description text,
    color character varying DEFAULT '#1f93ff'::character varying NOT NULL,
    show_on_sidebar boolean,
    account_id bigint,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.labels OWNER TO postgres;

--
-- TOC entry 293 (class 1259 OID 20080)
-- Name: labels_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.labels_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.labels_id_seq OWNER TO postgres;

--
-- TOC entry 4197 (class 0 OID 0)
-- Dependencies: 293
-- Name: labels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.labels_id_seq OWNED BY public.labels.id;


--
-- TOC entry 296 (class 1259 OID 20093)
-- Name: mentions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mentions (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    conversation_id bigint NOT NULL,
    account_id bigint NOT NULL,
    mentioned_at timestamp without time zone NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.mentions OWNER TO postgres;

--
-- TOC entry 295 (class 1259 OID 20092)
-- Name: mentions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.mentions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.mentions_id_seq OWNER TO postgres;

--
-- TOC entry 4198 (class 0 OID 0)
-- Dependencies: 295
-- Name: mentions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.mentions_id_seq OWNED BY public.mentions.id;


--
-- TOC entry 298 (class 1259 OID 20104)
-- Name: messages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.messages (
    id integer NOT NULL,
    content text,
    account_id integer NOT NULL,
    inbox_id integer NOT NULL,
    conversation_id integer NOT NULL,
    message_type integer NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    private boolean DEFAULT false,
    status integer DEFAULT 0,
    source_id character varying,
    content_type integer DEFAULT 0 NOT NULL,
    content_attributes json DEFAULT '{}'::json,
    sender_type character varying,
    sender_id bigint,
    external_source_ids jsonb DEFAULT '{}'::jsonb,
    additional_attributes jsonb DEFAULT '{}'::jsonb
);


ALTER TABLE public.messages OWNER TO postgres;

--
-- TOC entry 297 (class 1259 OID 20103)
-- Name: messages_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.messages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.messages_id_seq OWNER TO postgres;

--
-- TOC entry 4199 (class 0 OID 0)
-- Dependencies: 297
-- Name: messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.messages_id_seq OWNED BY public.messages.id;


--
-- TOC entry 300 (class 1259 OID 20125)
-- Name: notes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notes (
    id bigint NOT NULL,
    content text NOT NULL,
    account_id bigint NOT NULL,
    contact_id bigint NOT NULL,
    user_id bigint,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.notes OWNER TO postgres;

--
-- TOC entry 299 (class 1259 OID 20124)
-- Name: notes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.notes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.notes_id_seq OWNER TO postgres;

--
-- TOC entry 4200 (class 0 OID 0)
-- Dependencies: 299
-- Name: notes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notes_id_seq OWNED BY public.notes.id;


--
-- TOC entry 302 (class 1259 OID 20137)
-- Name: notification_settings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notification_settings (
    id bigint NOT NULL,
    account_id integer,
    user_id integer,
    email_flags integer DEFAULT 0 NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    push_flags integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.notification_settings OWNER TO postgres;

--
-- TOC entry 301 (class 1259 OID 20136)
-- Name: notification_settings_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.notification_settings_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.notification_settings_id_seq OWNER TO postgres;

--
-- TOC entry 4201 (class 0 OID 0)
-- Dependencies: 301
-- Name: notification_settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notification_settings_id_seq OWNED BY public.notification_settings.id;


--
-- TOC entry 304 (class 1259 OID 20147)
-- Name: notification_subscriptions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notification_subscriptions (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    subscription_type integer NOT NULL,
    subscription_attributes jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    identifier character varying
);


ALTER TABLE public.notification_subscriptions OWNER TO postgres;

--
-- TOC entry 303 (class 1259 OID 20146)
-- Name: notification_subscriptions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.notification_subscriptions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.notification_subscriptions_id_seq OWNER TO postgres;

--
-- TOC entry 4202 (class 0 OID 0)
-- Dependencies: 303
-- Name: notification_subscriptions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notification_subscriptions_id_seq OWNED BY public.notification_subscriptions.id;


--
-- TOC entry 306 (class 1259 OID 20159)
-- Name: notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notifications (
    id bigint NOT NULL,
    account_id bigint NOT NULL,
    user_id bigint NOT NULL,
    notification_type integer NOT NULL,
    primary_actor_type character varying NOT NULL,
    primary_actor_id bigint NOT NULL,
    secondary_actor_type character varying,
    secondary_actor_id bigint,
    read_at timestamp without time zone,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.notifications OWNER TO postgres;

--
-- TOC entry 305 (class 1259 OID 20158)
-- Name: notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.notifications_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.notifications_id_seq OWNER TO postgres;

--
-- TOC entry 4203 (class 0 OID 0)
-- Dependencies: 305
-- Name: notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notifications_id_seq OWNED BY public.notifications.id;


--
-- TOC entry 308 (class 1259 OID 20172)
-- Name: platform_app_permissibles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.platform_app_permissibles (
    id bigint NOT NULL,
    platform_app_id bigint NOT NULL,
    permissible_type character varying NOT NULL,
    permissible_id bigint NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.platform_app_permissibles OWNER TO postgres;

--
-- TOC entry 307 (class 1259 OID 20171)
-- Name: platform_app_permissibles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.platform_app_permissibles_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.platform_app_permissibles_id_seq OWNER TO postgres;

--
-- TOC entry 4204 (class 0 OID 0)
-- Dependencies: 307
-- Name: platform_app_permissibles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.platform_app_permissibles_id_seq OWNED BY public.platform_app_permissibles.id;


--
-- TOC entry 310 (class 1259 OID 20184)
-- Name: platform_apps; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.platform_apps (
    id bigint NOT NULL,
    name character varying NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.platform_apps OWNER TO postgres;

--
-- TOC entry 309 (class 1259 OID 20183)
-- Name: platform_apps_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.platform_apps_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.platform_apps_id_seq OWNER TO postgres;

--
-- TOC entry 4205 (class 0 OID 0)
-- Dependencies: 309
-- Name: platform_apps_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.platform_apps_id_seq OWNED BY public.platform_apps.id;


--
-- TOC entry 312 (class 1259 OID 20193)
-- Name: reporting_events; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reporting_events (
    id bigint NOT NULL,
    name character varying,
    value double precision,
    account_id integer,
    inbox_id integer,
    user_id integer,
    conversation_id integer,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    value_in_business_hours double precision,
    event_start_time timestamp without time zone,
    event_end_time timestamp without time zone
);


ALTER TABLE public.reporting_events OWNER TO postgres;

--
-- TOC entry 311 (class 1259 OID 20192)
-- Name: reporting_events_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.reporting_events_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.reporting_events_id_seq OWNER TO postgres;

--
-- TOC entry 4206 (class 0 OID 0)
-- Dependencies: 311
-- Name: reporting_events_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.reporting_events_id_seq OWNED BY public.reporting_events.id;


--
-- TOC entry 329 (class 1259 OID 20448)
-- Name: schema_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.schema_migrations (
    version character varying NOT NULL
);


ALTER TABLE public.schema_migrations OWNER TO postgres;

--
-- TOC entry 314 (class 1259 OID 20208)
-- Name: taggings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.taggings (
    id integer NOT NULL,
    tag_id integer,
    taggable_type character varying,
    taggable_id integer,
    tagger_type character varying,
    tagger_id integer,
    context character varying(128),
    created_at timestamp without time zone
);


ALTER TABLE public.taggings OWNER TO postgres;

--
-- TOC entry 313 (class 1259 OID 20207)
-- Name: taggings_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.taggings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.taggings_id_seq OWNER TO postgres;

--
-- TOC entry 4207 (class 0 OID 0)
-- Dependencies: 313
-- Name: taggings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.taggings_id_seq OWNED BY public.taggings.id;


--
-- TOC entry 316 (class 1259 OID 20226)
-- Name: tags; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tags (
    id integer NOT NULL,
    name character varying,
    taggings_count integer DEFAULT 0
);


ALTER TABLE public.tags OWNER TO postgres;

--
-- TOC entry 315 (class 1259 OID 20225)
-- Name: tags_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tags_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tags_id_seq OWNER TO postgres;

--
-- TOC entry 4208 (class 0 OID 0)
-- Dependencies: 315
-- Name: tags_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tags_id_seq OWNED BY public.tags.id;


--
-- TOC entry 318 (class 1259 OID 20237)
-- Name: team_members; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.team_members (
    id bigint NOT NULL,
    team_id bigint NOT NULL,
    user_id bigint NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.team_members OWNER TO postgres;

--
-- TOC entry 317 (class 1259 OID 20236)
-- Name: team_members_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.team_members_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.team_members_id_seq OWNER TO postgres;

--
-- TOC entry 4209 (class 0 OID 0)
-- Dependencies: 317
-- Name: team_members_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.team_members_id_seq OWNED BY public.team_members.id;


--
-- TOC entry 320 (class 1259 OID 20247)
-- Name: teams; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.teams (
    id bigint NOT NULL,
    name character varying NOT NULL,
    description text,
    allow_auto_assign boolean DEFAULT true,
    account_id bigint NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.teams OWNER TO postgres;

--
-- TOC entry 319 (class 1259 OID 20246)
-- Name: teams_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.teams_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.teams_id_seq OWNER TO postgres;

--
-- TOC entry 4210 (class 0 OID 0)
-- Dependencies: 319
-- Name: teams_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.teams_id_seq OWNED BY public.teams.id;


--
-- TOC entry 322 (class 1259 OID 20259)
-- Name: telegram_bots; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.telegram_bots (
    id integer NOT NULL,
    name character varying,
    auth_key character varying,
    account_id integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.telegram_bots OWNER TO postgres;

--
-- TOC entry 321 (class 1259 OID 20258)
-- Name: telegram_bots_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.telegram_bots_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.telegram_bots_id_seq OWNER TO postgres;

--
-- TOC entry 4211 (class 0 OID 0)
-- Dependencies: 321
-- Name: telegram_bots_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.telegram_bots_id_seq OWNED BY public.telegram_bots.id;


--
-- TOC entry 324 (class 1259 OID 20268)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    provider character varying DEFAULT 'email'::character varying NOT NULL,
    uid character varying DEFAULT ''::character varying NOT NULL,
    encrypted_password character varying DEFAULT ''::character varying NOT NULL,
    reset_password_token character varying,
    reset_password_sent_at timestamp without time zone,
    remember_created_at timestamp without time zone,
    sign_in_count integer DEFAULT 0 NOT NULL,
    current_sign_in_at timestamp without time zone,
    last_sign_in_at timestamp without time zone,
    current_sign_in_ip character varying,
    last_sign_in_ip character varying,
    confirmation_token character varying,
    confirmed_at timestamp without time zone,
    confirmation_sent_at timestamp without time zone,
    unconfirmed_email character varying,
    name character varying NOT NULL,
    display_name character varying,
    email character varying,
    tokens json,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    pubsub_token character varying,
    availability integer DEFAULT 0,
    ui_settings jsonb DEFAULT '{}'::jsonb,
    custom_attributes jsonb DEFAULT '{}'::jsonb,
    type character varying,
    message_signature text
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 323 (class 1259 OID 20267)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 4212 (class 0 OID 0)
-- Dependencies: 323
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 326 (class 1259 OID 20288)
-- Name: webhooks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.webhooks (
    id bigint NOT NULL,
    account_id integer,
    inbox_id integer,
    url character varying,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    webhook_type integer DEFAULT 0,
    subscriptions jsonb DEFAULT '["conversation_status_changed", "conversation_updated", "conversation_created", "message_created", "message_updated", "webwidget_triggered"]'::jsonb
);


ALTER TABLE public.webhooks OWNER TO postgres;

--
-- TOC entry 325 (class 1259 OID 20287)
-- Name: webhooks_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.webhooks_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.webhooks_id_seq OWNER TO postgres;

--
-- TOC entry 4213 (class 0 OID 0)
-- Dependencies: 325
-- Name: webhooks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.webhooks_id_seq OWNED BY public.webhooks.id;


--
-- TOC entry 328 (class 1259 OID 20300)
-- Name: working_hours; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.working_hours (
    id bigint NOT NULL,
    inbox_id bigint,
    account_id bigint,
    day_of_week integer NOT NULL,
    closed_all_day boolean DEFAULT false,
    open_hour integer,
    open_minutes integer,
    close_hour integer,
    close_minutes integer,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    open_all_day boolean DEFAULT false
);


ALTER TABLE public.working_hours OWNER TO postgres;

--
-- TOC entry 327 (class 1259 OID 20299)
-- Name: working_hours_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.working_hours_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.working_hours_id_seq OWNER TO postgres;

--
-- TOC entry 4214 (class 0 OID 0)
-- Dependencies: 327
-- Name: working_hours_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.working_hours_id_seq OWNED BY public.working_hours.id;


--
-- TOC entry 3462 (class 2604 OID 19590)
-- Name: access_tokens id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.access_tokens ALTER COLUMN id SET DEFAULT nextval('public.access_tokens_id_seq'::regclass);


--
-- TOC entry 3463 (class 2604 OID 19601)
-- Name: account_users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_users ALTER COLUMN id SET DEFAULT nextval('public.account_users_id_seq'::regclass);


--
-- TOC entry 3467 (class 2604 OID 19614)
-- Name: accounts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accounts ALTER COLUMN id SET DEFAULT nextval('public.accounts_id_seq'::regclass);


--
-- TOC entry 3472 (class 2604 OID 19627)
-- Name: action_mailbox_inbound_emails id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.action_mailbox_inbound_emails ALTER COLUMN id SET DEFAULT nextval('public.action_mailbox_inbound_emails_id_seq'::regclass);


--
-- TOC entry 3474 (class 2604 OID 19638)
-- Name: active_storage_attachments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.active_storage_attachments ALTER COLUMN id SET DEFAULT nextval('public.active_storage_attachments_id_seq'::regclass);


--
-- TOC entry 3475 (class 2604 OID 19649)
-- Name: active_storage_blobs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.active_storage_blobs ALTER COLUMN id SET DEFAULT nextval('public.active_storage_blobs_id_seq'::regclass);


--
-- TOC entry 3476 (class 2604 OID 19659)
-- Name: active_storage_variant_records id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.active_storage_variant_records ALTER COLUMN id SET DEFAULT nextval('public.active_storage_variant_records_id_seq'::regclass);


--
-- TOC entry 3477 (class 2604 OID 19669)
-- Name: agent_bot_inboxes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agent_bot_inboxes ALTER COLUMN id SET DEFAULT nextval('public.agent_bot_inboxes_id_seq'::regclass);


--
-- TOC entry 3479 (class 2604 OID 19677)
-- Name: agent_bots id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agent_bots ALTER COLUMN id SET DEFAULT nextval('public.agent_bots_id_seq'::regclass);


--
-- TOC entry 3480 (class 2604 OID 19687)
-- Name: attachments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attachments ALTER COLUMN id SET DEFAULT nextval('public.attachments_id_seq'::regclass);


--
-- TOC entry 3484 (class 2604 OID 19699)
-- Name: automation_rules id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.automation_rules ALTER COLUMN id SET DEFAULT nextval('public.automation_rules_id_seq'::regclass);


--
-- TOC entry 3488 (class 2604 OID 19712)
-- Name: campaigns id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.campaigns ALTER COLUMN id SET DEFAULT nextval('public.campaigns_id_seq'::regclass);


--
-- TOC entry 3495 (class 2604 OID 19732)
-- Name: canned_responses id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.canned_responses ALTER COLUMN id SET DEFAULT nextval('public.canned_responses_id_seq'::regclass);


--
-- TOC entry 3496 (class 2604 OID 19741)
-- Name: channel_api id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.channel_api ALTER COLUMN id SET DEFAULT nextval('public.channel_api_id_seq'::regclass);


--
-- TOC entry 3498 (class 2604 OID 19753)
-- Name: channel_email id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.channel_email ALTER COLUMN id SET DEFAULT nextval('public.channel_email_id_seq'::regclass);


--
-- TOC entry 3515 (class 2604 OID 19780)
-- Name: channel_facebook_pages id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.channel_facebook_pages ALTER COLUMN id SET DEFAULT nextval('public.channel_facebook_pages_id_seq'::regclass);


--
-- TOC entry 3516 (class 2604 OID 19791)
-- Name: channel_line id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.channel_line ALTER COLUMN id SET DEFAULT nextval('public.channel_line_id_seq'::regclass);


--
-- TOC entry 3517 (class 2604 OID 19801)
-- Name: channel_sms id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.channel_sms ALTER COLUMN id SET DEFAULT nextval('public.channel_sms_id_seq'::regclass);


--
-- TOC entry 3520 (class 2604 OID 19813)
-- Name: channel_telegram id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.channel_telegram ALTER COLUMN id SET DEFAULT nextval('public.channel_telegram_id_seq'::regclass);


--
-- TOC entry 3521 (class 2604 OID 19823)
-- Name: channel_twilio_sms id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.channel_twilio_sms ALTER COLUMN id SET DEFAULT nextval('public.channel_twilio_sms_id_seq'::regclass);


--
-- TOC entry 3523 (class 2604 OID 19835)
-- Name: channel_twitter_profiles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.channel_twitter_profiles ALTER COLUMN id SET DEFAULT nextval('public.channel_twitter_profiles_id_seq'::regclass);


--
-- TOC entry 3525 (class 2604 OID 19846)
-- Name: channel_web_widgets id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.channel_web_widgets ALTER COLUMN id SET DEFAULT nextval('public.channel_web_widgets_id_seq'::regclass);


--
-- TOC entry 3533 (class 2604 OID 19864)
-- Name: channel_whatsapp id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.channel_whatsapp ALTER COLUMN id SET DEFAULT nextval('public.channel_whatsapp_id_seq'::regclass);


--
-- TOC entry 3537 (class 2604 OID 19877)
-- Name: contact_inboxes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contact_inboxes ALTER COLUMN id SET DEFAULT nextval('public.contact_inboxes_id_seq'::regclass);


--
-- TOC entry 3539 (class 2604 OID 19892)
-- Name: contacts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contacts ALTER COLUMN id SET DEFAULT nextval('public.contacts_id_seq'::regclass);


--
-- TOC entry 3542 (class 2604 OID 19907)
-- Name: conversations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conversations ALTER COLUMN id SET DEFAULT nextval('public.conversations_id_seq'::regclass);


--
-- TOC entry 3548 (class 2604 OID 19929)
-- Name: csat_survey_responses id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.csat_survey_responses ALTER COLUMN id SET DEFAULT nextval('public.csat_survey_responses_id_seq'::regclass);


--
-- TOC entry 3549 (class 2604 OID 19943)
-- Name: custom_attribute_definitions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.custom_attribute_definitions ALTER COLUMN id SET DEFAULT nextval('public.custom_attribute_definitions_id_seq'::regclass);


--
-- TOC entry 3553 (class 2604 OID 19957)
-- Name: custom_filters id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.custom_filters ALTER COLUMN id SET DEFAULT nextval('public.custom_filters_id_seq'::regclass);


--
-- TOC entry 3556 (class 2604 OID 19970)
-- Name: data_imports id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.data_imports ALTER COLUMN id SET DEFAULT nextval('public.data_imports_id_seq'::regclass);


--
-- TOC entry 3558 (class 2604 OID 19981)
-- Name: email_templates id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.email_templates ALTER COLUMN id SET DEFAULT nextval('public.email_templates_id_seq'::regclass);


--
-- TOC entry 3561 (class 2604 OID 19993)
-- Name: inbox_members id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inbox_members ALTER COLUMN id SET DEFAULT nextval('public.inbox_members_id_seq'::regclass);


--
-- TOC entry 3562 (class 2604 OID 20002)
-- Name: inboxes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inboxes ALTER COLUMN id SET DEFAULT nextval('public.inboxes_id_seq'::regclass);


--
-- TOC entry 3570 (class 2604 OID 20019)
-- Name: installation_configs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.installation_configs ALTER COLUMN id SET DEFAULT nextval('public.installation_configs_id_seq'::regclass);


--
-- TOC entry 3573 (class 2604 OID 20032)
-- Name: integrations_hooks id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.integrations_hooks ALTER COLUMN id SET DEFAULT nextval('public.integrations_hooks_id_seq'::regclass);


--
-- TOC entry 3577 (class 2604 OID 20044)
-- Name: kbase_articles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kbase_articles ALTER COLUMN id SET DEFAULT nextval('public.kbase_articles_id_seq'::regclass);


--
-- TOC entry 3578 (class 2604 OID 20053)
-- Name: kbase_categories id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kbase_categories ALTER COLUMN id SET DEFAULT nextval('public.kbase_categories_id_seq'::regclass);


--
-- TOC entry 3580 (class 2604 OID 20064)
-- Name: kbase_folders id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kbase_folders ALTER COLUMN id SET DEFAULT nextval('public.kbase_folders_id_seq'::regclass);


--
-- TOC entry 3581 (class 2604 OID 20073)
-- Name: kbase_portals id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kbase_portals ALTER COLUMN id SET DEFAULT nextval('public.kbase_portals_id_seq'::regclass);


--
-- TOC entry 3583 (class 2604 OID 20084)
-- Name: labels id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.labels ALTER COLUMN id SET DEFAULT nextval('public.labels_id_seq'::regclass);


--
-- TOC entry 3585 (class 2604 OID 20096)
-- Name: mentions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mentions ALTER COLUMN id SET DEFAULT nextval('public.mentions_id_seq'::regclass);


--
-- TOC entry 3586 (class 2604 OID 20107)
-- Name: messages id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages ALTER COLUMN id SET DEFAULT nextval('public.messages_id_seq'::regclass);


--
-- TOC entry 3593 (class 2604 OID 20128)
-- Name: notes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notes ALTER COLUMN id SET DEFAULT nextval('public.notes_id_seq'::regclass);


--
-- TOC entry 3594 (class 2604 OID 20140)
-- Name: notification_settings id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification_settings ALTER COLUMN id SET DEFAULT nextval('public.notification_settings_id_seq'::regclass);


--
-- TOC entry 3597 (class 2604 OID 20150)
-- Name: notification_subscriptions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification_subscriptions ALTER COLUMN id SET DEFAULT nextval('public.notification_subscriptions_id_seq'::regclass);


--
-- TOC entry 3599 (class 2604 OID 20162)
-- Name: notifications id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications ALTER COLUMN id SET DEFAULT nextval('public.notifications_id_seq'::regclass);


--
-- TOC entry 3600 (class 2604 OID 20175)
-- Name: platform_app_permissibles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.platform_app_permissibles ALTER COLUMN id SET DEFAULT nextval('public.platform_app_permissibles_id_seq'::regclass);


--
-- TOC entry 3601 (class 2604 OID 20187)
-- Name: platform_apps id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.platform_apps ALTER COLUMN id SET DEFAULT nextval('public.platform_apps_id_seq'::regclass);


--
-- TOC entry 3602 (class 2604 OID 20196)
-- Name: reporting_events id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reporting_events ALTER COLUMN id SET DEFAULT nextval('public.reporting_events_id_seq'::regclass);


--
-- TOC entry 3603 (class 2604 OID 20211)
-- Name: taggings id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.taggings ALTER COLUMN id SET DEFAULT nextval('public.taggings_id_seq'::regclass);


--
-- TOC entry 3604 (class 2604 OID 20229)
-- Name: tags id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tags ALTER COLUMN id SET DEFAULT nextval('public.tags_id_seq'::regclass);


--
-- TOC entry 3606 (class 2604 OID 20240)
-- Name: team_members id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.team_members ALTER COLUMN id SET DEFAULT nextval('public.team_members_id_seq'::regclass);


--
-- TOC entry 3607 (class 2604 OID 20250)
-- Name: teams id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teams ALTER COLUMN id SET DEFAULT nextval('public.teams_id_seq'::regclass);


--
-- TOC entry 3609 (class 2604 OID 20262)
-- Name: telegram_bots id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.telegram_bots ALTER COLUMN id SET DEFAULT nextval('public.telegram_bots_id_seq'::regclass);


--
-- TOC entry 3610 (class 2604 OID 20271)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 3618 (class 2604 OID 20291)
-- Name: webhooks id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.webhooks ALTER COLUMN id SET DEFAULT nextval('public.webhooks_id_seq'::regclass);


--
-- TOC entry 3621 (class 2604 OID 20303)
-- Name: working_hours id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.working_hours ALTER COLUMN id SET DEFAULT nextval('public.working_hours_id_seq'::regclass);


--
-- TOC entry 4036 (class 0 OID 19587)
-- Dependencies: 216
-- Data for Name: access_tokens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.access_tokens (id, owner_type, owner_id, token, created_at, updated_at) FROM stdin;
1	User	1	UeKHzDoUyB89sCKzU74MqMmS	2022-06-03 07:01:05.177179	2022-06-03 07:01:05.177179
2	User	2	wRDyq7iVZQqu6miDPNgEeJtE	2022-06-03 08:33:22.733361	2022-06-03 08:33:22.733361
\.


--
-- TOC entry 4038 (class 0 OID 19598)
-- Dependencies: 218
-- Data for Name: account_users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.account_users (id, account_id, user_id, role, inviter_id, created_at, updated_at, active_at, availability, auto_offline) FROM stdin;
1	1	1	1	\N	2022-06-03 07:01:05.364764	2022-06-03 07:01:05.364764	\N	0	t
2	1	2	1	1	2022-06-03 08:33:22.781637	2022-06-03 08:33:22.781637	\N	0	t
\.


--
-- TOC entry 4040 (class 0 OID 19611)
-- Dependencies: 220
-- Data for Name: accounts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.accounts (id, name, created_at, updated_at, locale, domain, support_email, settings_flags, feature_flags, auto_resolve_duration, limits) FROM stdin;
1	PHP Group International	2022-06-03 07:01:04.876603	2022-06-07 00:33:11.988969	0	\N		0	15	\N	{}
\.


--
-- TOC entry 4042 (class 0 OID 19624)
-- Dependencies: 222
-- Data for Name: action_mailbox_inbound_emails; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.action_mailbox_inbound_emails (id, status, message_id, message_checksum, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 4044 (class 0 OID 19635)
-- Dependencies: 224
-- Data for Name: active_storage_attachments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.active_storage_attachments (id, name, record_type, record_id, blob_id, created_at) FROM stdin;
6	avatar	Inbox	1	6	2022-06-03 09:10:53.878206
7	file	Attachment	1	7	2022-06-03 14:20:21.947488
8	file	Attachment	2	8	2022-06-07 00:21:31.695753
\.


--
-- TOC entry 4046 (class 0 OID 19646)
-- Dependencies: 226
-- Data for Name: active_storage_blobs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.active_storage_blobs (id, key, filename, content_type, metadata, byte_size, checksum, created_at, service_name) FROM stdin;
1	8er3q07h0z05py37jvetgkrrmerq	Mini logo for Website.png	image/png	{"identified":true}	4647	6svibgL2OdW82f1a4O1//A==	2022-06-03 08:11:34.438216	amazon
2	33xirt897y5168u1a0johtioq8cy	Mini logo for Website.png	image/png	{"identified":true}	4647	6svibgL2OdW82f1a4O1//A==	2022-06-03 08:25:13.142187	amazon
6	9k4600ehbygp4p05zkrh46vd7nzo	Mini logo for Website.png	image/png	{"identified":true,"width":256,"height":257,"analyzed":true}	4647	6svibgL2OdW82f1a4O1//A==	2022-06-03 09:10:53.858735	s3_compatible
7	u4newh52d5oi0y0yl86u1el5ayrt	1A3_cf16065e2dc098601022e76e28419a0a.pdf	application/pdf	{"identified":true,"analyzed":true}	868126	WZSaZSD3wsIlQNa7153IsQ==	2022-06-03 14:20:21.902247	s3_compatible
8	jad03t2bzif1oyg6dfx9km37v7x0	Untitled.png	image/png	{"identified":true,"width":128,"height":128,"analyzed":true}	4617	rvkKxYJxwEyP0STDKmMpIg==	2022-06-07 00:21:31.683107	s3_compatible
\.


--
-- TOC entry 4048 (class 0 OID 19656)
-- Dependencies: 228
-- Data for Name: active_storage_variant_records; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.active_storage_variant_records (id, blob_id, variation_digest) FROM stdin;
\.


--
-- TOC entry 4050 (class 0 OID 19666)
-- Dependencies: 230
-- Data for Name: agent_bot_inboxes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.agent_bot_inboxes (id, inbox_id, agent_bot_id, status, created_at, updated_at, account_id) FROM stdin;
\.


--
-- TOC entry 4052 (class 0 OID 19674)
-- Dependencies: 232
-- Data for Name: agent_bots; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.agent_bots (id, name, description, outgoing_url, created_at, updated_at, account_id) FROM stdin;
\.


--
-- TOC entry 4150 (class 0 OID 20455)
-- Dependencies: 330
-- Data for Name: ar_internal_metadata; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ar_internal_metadata (key, value, created_at, updated_at) FROM stdin;
environment	production	2022-06-03 06:56:26.014589	2022-06-03 06:56:26.014589
schema_sha1	f2b755a079728d072d1e7e3467effe5ccf25a73c	2022-06-03 06:56:26.0922	2022-06-03 06:56:26.0922
\.


--
-- TOC entry 4054 (class 0 OID 19684)
-- Dependencies: 234
-- Data for Name: attachments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.attachments (id, file_type, external_url, coordinates_lat, coordinates_long, message_id, account_id, created_at, updated_at, fallback_title, extension) FROM stdin;
1	3	\N	0	0	14	1	2022-06-03 14:20:21.854457	2022-06-03 14:20:21.974984	\N	\N
2	0	\N	0	0	186	1	2022-06-07 00:21:31.671266	2022-06-07 00:21:31.701817	\N	\N
\.


--
-- TOC entry 4056 (class 0 OID 19696)
-- Dependencies: 236
-- Data for Name: automation_rules; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.automation_rules (id, account_id, name, description, event_name, conditions, actions, created_at, updated_at, active) FROM stdin;
5	1	Detect Feedback	Kiểm tra xem phản hồi có phải feedback không	message_created	[{"values": ["#feedback"], "attribute_key": "content", "filter_operator": "contains"}]	[{"action_name": "assign_team", "action_params": [2]}, {"action_name": "add_label", "action_params": ["feedback"]}]	2022-06-06 06:51:08.081479	2022-06-07 07:16:01.14816	t
6	1	Detect Request	Kiểm tra xem phản hồi có phải request không	message_created	[{"values": ["#request"], "attribute_key": "content", "filter_operator": "contains"}]	[{"action_name": "assign_team", "action_params": [2]}, {"action_name": "add_label", "action_params": ["request"]}]	2022-06-06 06:52:28.071106	2022-06-07 07:16:08.062483	t
3	1	Detect Bug	Kiểm tra xem phản hồi có phải bug không	message_created	[{"values": ["#bug"], "attribute_key": "content", "filter_operator": "contains"}]	[{"action_name": "assign_team", "action_params": [2]}, {"action_name": "add_label", "action_params": ["bug"]}, {"action_name": "send_webhook_event", "action_params": ["http://33d2-14-241-247-213.ngrok.io/automation"]}]	2022-06-06 06:50:46.922798	2022-06-08 00:20:41.825676	t
\.


--
-- TOC entry 4058 (class 0 OID 19709)
-- Dependencies: 238
-- Data for Name: campaigns; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.campaigns (id, display_id, title, description, message, sender_id, enabled, account_id, inbox_id, trigger_rules, created_at, updated_at, campaign_type, campaign_status, audience, scheduled_at, trigger_only_during_business_hours) FROM stdin;
\.


--
-- TOC entry 4060 (class 0 OID 19729)
-- Dependencies: 240
-- Data for Name: canned_responses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.canned_responses (id, account_id, short_code, content, created_at, updated_at) FROM stdin;
1	1	bug_short_curt	BUG	2022-06-06 08:01:53.401684	2022-06-06 08:01:53.401684
\.


--
-- TOC entry 4062 (class 0 OID 19738)
-- Dependencies: 242
-- Data for Name: channel_api; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.channel_api (id, account_id, webhook_url, created_at, updated_at, identifier, hmac_token, hmac_mandatory) FROM stdin;
\.


--
-- TOC entry 4064 (class 0 OID 19750)
-- Dependencies: 244
-- Data for Name: channel_email; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.channel_email (id, account_id, email, forward_to_email, created_at, updated_at, imap_enabled, imap_address, imap_port, imap_login, imap_password, imap_enable_ssl, imap_inbox_synced_at, smtp_enabled, smtp_address, smtp_port, smtp_login, smtp_password, smtp_domain, smtp_enable_starttls_auto, smtp_authentication, smtp_openssl_verify_mode, smtp_enable_ssl_tls) FROM stdin;
\.


--
-- TOC entry 4066 (class 0 OID 19777)
-- Dependencies: 246
-- Data for Name: channel_facebook_pages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.channel_facebook_pages (id, page_id, user_access_token, page_access_token, account_id, created_at, updated_at, instagram_id) FROM stdin;
\.


--
-- TOC entry 4068 (class 0 OID 19788)
-- Dependencies: 248
-- Data for Name: channel_line; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.channel_line (id, account_id, line_channel_id, line_channel_secret, line_channel_token, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 4070 (class 0 OID 19798)
-- Dependencies: 250
-- Data for Name: channel_sms; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.channel_sms (id, account_id, phone_number, provider, provider_config, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 4072 (class 0 OID 19810)
-- Dependencies: 252
-- Data for Name: channel_telegram; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.channel_telegram (id, bot_name, account_id, bot_token, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 4074 (class 0 OID 19820)
-- Dependencies: 254
-- Data for Name: channel_twilio_sms; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.channel_twilio_sms (id, phone_number, auth_token, account_sid, account_id, created_at, updated_at, medium) FROM stdin;
\.


--
-- TOC entry 4076 (class 0 OID 19832)
-- Dependencies: 256
-- Data for Name: channel_twitter_profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.channel_twitter_profiles (id, profile_id, twitter_access_token, twitter_access_token_secret, account_id, created_at, updated_at, tweets_enabled) FROM stdin;
\.


--
-- TOC entry 4078 (class 0 OID 19843)
-- Dependencies: 258
-- Data for Name: channel_web_widgets; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.channel_web_widgets (id, website_url, account_id, created_at, updated_at, website_token, widget_color, welcome_title, welcome_tagline, feature_flags, reply_time, hmac_token, pre_chat_form_enabled, pre_chat_form_options, hmac_mandatory, continuity_via_email) FROM stdin;
1	sye.vn	1	2022-06-03 07:53:51.271453	2022-06-07 07:50:19.325954	USJX57GDuCCqsmnywbJmoYhE	#3038A0			3	0	yhaFkWBjhJXJUy3sNdZ5UW4Q	f	{"pre_chat_fields": [{"name": "emailAddress", "type": "email", "label": "Email Address", "enabled": true, "required": true, "field_type": "standard", "placeholder": "Please enter your email address"}, {"name": "fullName", "type": "text", "label": "Full Name", "enabled": true, "required": false, "field_type": "standard", "placeholder": "Please enter your full name"}, {"name": "phoneNumber", "type": "text", "label": "Phone Number", "enabled": false, "required": false, "field_type": "standard", "placeholder": "Please enter your phone number"}, {"name": "type_message", "type": "list", "label": "Type Message", "values": ["Bug", "Request"], "enabled": true, "required": true, "field_type": "contact_attribute", "placeholder": "Type Message"}], "pre_chat_message": "Share your queries or comments here !!!!!!!!!"}	f	t
\.


--
-- TOC entry 4080 (class 0 OID 19861)
-- Dependencies: 260
-- Data for Name: channel_whatsapp; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.channel_whatsapp (id, account_id, phone_number, provider, provider_config, created_at, updated_at, message_templates, message_templates_last_updated) FROM stdin;
\.


--
-- TOC entry 4082 (class 0 OID 19874)
-- Dependencies: 262
-- Data for Name: contact_inboxes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.contact_inboxes (id, contact_id, inbox_id, source_id, created_at, updated_at, hmac_verified, pubsub_token) FROM stdin;
1	1	1	1dfc2d6e-1804-49de-abf4-24efbdb8c7dd	2022-06-03 08:44:15.604414	2022-06-03 08:44:15.604414	f	dJNfWbgU7e9wwKpitoQ5WVH3
2	2	1	0d2b9d7e-f403-4a30-97a5-c159d5051d2b	2022-06-03 09:35:15.073246	2022-06-03 09:35:15.073246	f	6qWiJVTKXbRTftE8LHzG2NLX
3	3	1	fb77860b-c46a-4511-a878-813243903987	2022-06-03 09:35:43.281118	2022-06-03 09:35:43.281118	f	EQhaEZKSL85wVHxnE7Vmj1qf
4	4	1	18fe0296-b618-4e6e-8b5f-3291cdfa22aa	2022-06-03 09:40:36.505016	2022-06-03 09:40:36.505016	f	nz7ZChKbzTAUWykHezMYrGiN
5	5	1	24dfff8d-d970-4431-aea3-d5d38eda050e	2022-06-03 14:11:51.539521	2022-06-03 14:11:51.539521	f	mGouG6ppYUHYPFXwR3AZ6F9U
6	6	1	a933b15e-8082-4063-9bba-ab8cf501f011	2022-06-03 14:11:52.725372	2022-06-03 14:11:52.725372	f	74hfekSQM2skYAndx2fhDn9A
7	7	1	d9462706-4cb9-42bf-bf51-50043fab4df9	2022-06-03 14:11:56.578782	2022-06-03 14:11:56.578782	f	wfW2zdQdLC4VFWktiZ1B3GQP
8	8	1	ee6f9d7e-606a-466d-b408-955ebecf93d0	2022-06-03 14:15:40.991368	2022-06-03 14:15:40.991368	f	oVPriVN4CibzkRtbnSqBr7PU
9	9	1	b5488751-8424-45d2-a47e-fff03130c3d6	2022-06-03 15:25:54.604659	2022-06-03 15:25:54.604659	f	Hygzac7V1Adkp8eCEAk3EWT1
10	10	1	ac2dd33c-cfbb-4bb0-8e4e-43a674a99b59	2022-06-03 15:25:56.167776	2022-06-03 15:25:56.167776	f	vKg7mP5mFdJReswLNPRqbhZG
12	12	1	ddf41a84-edbd-4e75-a80f-76d2f7f975a0	2022-06-03 23:47:23.297162	2022-06-03 23:47:23.297162	f	1iQjxo6MN45tjKSyUxkwNcbL
13	13	1	07842eee-d9f6-4e66-8480-7fa84dc5f4da	2022-06-03 23:47:24.859224	2022-06-03 23:47:24.859224	f	JkQ8rNnFmDzanmnagSCKKjMx
14	14	1	f5996091-75d7-425b-89a7-7f4ebc1ccd2e	2022-06-04 06:16:44.786667	2022-06-04 06:16:44.786667	f	kaMamidrS74k2ABGawuNR4ro
15	15	1	0a78774f-d54c-4173-ad27-e026c893b426	2022-06-04 07:15:52.61952	2022-06-04 07:15:52.61952	f	EehSpqsSvpRFHXufJXLhNG67
16	16	1	c72370f4-cdeb-4322-a1e8-239a51415ab8	2022-06-04 07:15:53.608047	2022-06-04 07:15:53.608047	f	uj5dPTQreB9W1hCDWjvUYbHY
17	17	1	f8c879eb-3f5b-455f-a623-95d0d1c2d207	2022-06-04 07:25:36.60575	2022-06-04 07:25:36.60575	f	hKvi2wDsNUyhRMzHp4ZTb1UW
19	19	1	db74cc18-1832-4576-976a-005158f00cb8	2022-06-04 09:15:57.770361	2022-06-04 09:15:57.770361	f	En1WW5rUqcgmrWTAU6LuyVEm
20	20	1	b4150059-588b-4c29-82aa-f297bd6fef74	2022-06-04 09:16:00.912138	2022-06-04 09:16:00.912138	f	o8PjMB4ZEcvyiFr9iCSDw53E
21	21	1	9729947d-a184-47cc-bed2-9db85626874c	2022-06-06 00:01:22.389782	2022-06-06 00:01:22.389782	f	zqH43J11ch3J2az4vfgEyA3q
22	22	1	19a34980-10cc-496c-808d-3b97363282ca	2022-06-06 00:04:12.843391	2022-06-06 00:04:12.843391	f	YuiaDoXymXwvWxgm54aJeewk
25	28	1	330fd8ad-2c9f-4dfb-9475-211b0f96942e	2022-06-06 02:07:59.667639	2022-06-06 02:07:59.667639	f	B1mh6FUuLWMCVmaptEGQQt3i
26	29	1	9232af39-3e97-4592-aa4e-b9180ba08822	2022-06-06 02:08:00.488076	2022-06-06 02:08:00.488076	f	9omZVDkdts5b5VSgGP2vvy39
28	31	1	f5dda347-68f2-4a4c-bf09-11df8ed87e1a	2022-06-06 02:11:45.494036	2022-06-06 02:11:45.494036	f	4KQeACKR48oftdUahLABCYod
30	33	1	28abe823-3acc-4a2b-8d3c-50a60bc4efc4	2022-06-06 02:14:16.33557	2022-06-06 02:14:16.33557	f	kt3g9EDVfviPjcP3rpYDMTgC
31	34	1	d7b96603-8faf-44ad-990f-46e5d450474a	2022-06-06 02:18:07.405497	2022-06-06 02:18:07.405497	f	httgnnZcktLvhqxJM7FS88gk
32	35	1	7f37e2cb-74d0-4d25-bf8a-471c41986b6a	2022-06-06 02:19:58.097722	2022-06-06 02:19:58.097722	f	hJPXkgHstURRrGGNv8h768NK
34	37	1	a0477cc2-b759-44cb-bee9-c716408daa9e	2022-06-06 02:24:39.477375	2022-06-06 02:24:39.477375	f	UPGQtG1DGpp9z8y6M3BxQC1v
36	39	1	b7893731-2b8b-4f6c-a9c9-f98395ef7b64	2022-06-06 02:44:59.638612	2022-06-06 02:44:59.638612	f	KL5mbP32yNrvpgyumHoucj29
37	40	1	7cf5137b-4310-47ce-8c78-fce23820873c	2022-06-06 02:45:05.179121	2022-06-06 02:45:05.179121	f	V9yoqLDgf8yoMspTcUVE1Ydu
39	42	1	7bb37e07-73b2-4f20-863e-2543929d1416	2022-06-06 02:47:24.786712	2022-06-06 02:47:24.786712	f	w3ePKy15fEp5kdVLGZSYcaQo
41	44	1	dc8b4d7e-a909-448d-92f7-77bd553a3e9e	2022-06-06 02:50:50.218951	2022-06-06 02:50:50.218951	f	t87vnhcxh3uFbDDp31CbJUHj
42	45	1	9f0abc89-63b8-47c4-9aa2-25e70931cd92	2022-06-06 02:51:47.87475	2022-06-06 02:51:47.87475	f	3uaGNpZZvYg8n5sU7LYps2Sb
44	47	1	46ae57b4-1328-4758-9b49-7c04ecc055c0	2022-06-06 03:10:04.580093	2022-06-06 03:10:04.580093	f	exbKQ9uKsBTyExrwC9imT3us
46	49	1	de71c674-68e7-45ae-8c55-6f55bb63fd7e	2022-06-06 03:25:32.833974	2022-06-06 03:25:32.833974	f	hpUeV4daitdcTYMYrfcAXu5Y
47	50	1	5752d977-6e34-44ef-b1c4-03c69c541fa7	2022-06-06 03:25:39.188545	2022-06-06 03:25:39.188545	f	1HixztdQVDzEX5WQiNH6M4X2
50	54	1	506888a2-7534-49c9-a582-65cb9ed399b3	2022-06-06 04:23:25.650973	2022-06-06 04:23:25.650973	f	U5PWxqL3BZXSrhgNZE2tgBFM
51	55	1	232e29e4-80cb-40de-aaf1-ac4b193db0ba	2022-06-06 04:23:26.763576	2022-06-06 04:23:26.763576	f	8ABZKwgJsKFs2MNDebVjSyeb
52	57	1	a6e053b4-b994-4861-b920-5b2182474f1b	2022-06-06 04:31:02.59947	2022-06-06 04:31:02.59947	f	H8JP5yZnhy3q9qa17PCXAxFT
53	58	1	43ef2065-8201-4e90-bb56-c56be05a1989	2022-06-06 04:31:03.424225	2022-06-06 04:31:03.424225	f	f9getRRyjrhBsMB2gpLqYTHg
54	59	1	1bc19bbd-9441-4efd-8694-bc674d5c5fb6	2022-06-06 04:31:14.826432	2022-06-06 04:31:14.826432	f	2brHYXVUbj8jySrDGQgmezgL
55	60	1	bf7e4ea1-0e7e-476b-9e66-c663fa11d4f4	2022-06-06 04:31:15.881424	2022-06-06 04:31:15.881424	f	1bJUNsGkuxKse2ss7TZ87SxJ
56	61	1	fd4f6f90-a134-4e29-a728-bf5d5d4212ad	2022-06-06 05:56:50.728919	2022-06-06 05:56:50.728919	f	Qx3bGmXK2PLh87RhPsHs4j5u
58	63	1	acf35cf2-09b4-4e14-981b-2b35612250eb	2022-06-06 05:59:54.52131	2022-06-06 05:59:54.52131	f	mERpZi7FR7hh2gYgUXPVHXNM
59	64	1	73344358-3b11-48df-9c9a-18339499f3ce	2022-06-06 05:59:55.663293	2022-06-06 05:59:55.663293	f	x8iMwMq2pRrEJHadxjg9kWh4
60	65	1	79caf961-6a40-4b46-a796-b0dd952c857c	2022-06-06 06:00:40.056613	2022-06-06 06:00:40.056613	f	XUPdgL97J5kdRaxA9HwzG2vY
49	56	1	e1937945-bc6f-4674-8012-fbc9299ecfa1	2022-06-06 04:17:28.094047	2022-06-06 06:27:38.543809	f	UxiUdbBzJsepumN6UN4muN6b
63	68	1	6df4c123-0454-497a-8469-11a1e8a0375e	2022-06-06 07:41:16.897702	2022-06-06 07:41:16.897702	f	mCvPEkGsXx43ZEfoiKpv1SfS
64	69	1	41f2321e-615c-4685-87f4-302bec340313	2022-06-06 07:41:17.716847	2022-06-06 07:41:17.716847	f	WemGpRrstsomEiqF6DvYvKJs
65	70	1	fb823256-83e0-41af-88f8-ca1bec7193b3	2022-06-06 07:45:37.847783	2022-06-06 07:45:37.847783	f	MCG9kYBmkq7byCGhUmrv21fV
66	71	1	5ab53fc1-2eb1-478e-81b4-52b3759c61c7	2022-06-06 08:22:09.576584	2022-06-06 08:22:09.576584	f	EA9gZFNb2RDW6sxNUenGCAfD
67	72	1	fb703a8d-805b-4023-9062-d6e18cd37d36	2022-06-06 08:22:11.188423	2022-06-06 08:22:11.188423	f	i1ng3mY1onyn7HRH3mzr9Njd
68	73	1	b953a8a0-c2bd-4359-85db-ffb51824dc58	2022-06-06 08:42:07.850443	2022-06-06 08:42:07.850443	f	eeBeyz9FA45UTipBqRJ49hVx
69	74	1	69d1d81f-95bb-435b-9c7e-3aaa6c0fc9cb	2022-06-06 08:42:09.250554	2022-06-06 08:42:09.250554	f	HhNRZsDtQgNQtRcnEJa23pg6
70	75	1	976c1d1d-3ade-4e81-9b03-5d2a019f2a10	2022-06-06 09:19:22.320337	2022-06-06 09:19:22.320337	f	t7DRpoAPCHu8aeHTDjvvHiLS
73	78	1	553d53ae-d35f-4f39-a3ce-276a49de2b67	2022-06-06 09:23:56.163976	2022-06-06 09:23:56.163976	f	e3X6cXGfN53ciJN9H4DkmVsW
72	77	1	c2731453-6c1c-40c3-ba57-8cb5ff98d1dd	2022-06-06 09:23:19.965163	2022-06-06 09:23:19.965163	f	iRvD59cfr3XucMvcaJqRdjhV
75	80	1	f376d97d-b079-469f-afa9-13d7afcc94a9	2022-06-06 09:27:06.903337	2022-06-06 09:27:28.761022	f	Xn5zGa6r8xF5dByrXyrmDNvw
77	83	1	30aff88d-9667-4531-bb8e-a64d70336125	2022-06-06 09:39:08.228097	2022-06-06 09:39:08.228097	f	SUiFMjkfZ54MC6HXdN3jyXGw
76	80	1	fdf52203-68f0-41fa-8fbb-a59a76f950f8	2022-06-06 09:32:02.063517	2022-06-06 23:57:09.601442	f	FZYtmEL8WVHzhpUUDLxrmZR6
78	84	1	6e568032-8e91-4ca6-bc26-dcb41ceca87d	2022-06-07 00:28:12.033389	2022-06-07 00:28:12.033389	f	kTvZNDH3Be9PRHT3JtoHmttk
79	80	1	82f61155-02d5-435b-8896-a7aee33ea6b7	2022-06-07 00:28:12.873709	2022-06-07 00:28:35.32801	f	qsX43cXVBczmjcUVM6CQn7AF
80	86	1	7f30631b-63bf-44a3-b083-8f43900a4359	2022-06-07 00:51:13.457311	2022-06-07 00:51:13.457311	f	v55cPZVPfjUrAoZXi9EZhAxa
81	87	1	8f55c27a-6646-486b-89ca-b383ffb66342	2022-06-07 01:36:33.171112	2022-06-07 01:36:33.171112	f	rDhKsTpgLZqS4FwgG8o49Jg8
82	80	1	a588bb17-168b-4111-bd74-d9cf0909eb90	2022-06-07 01:36:34.616551	2022-06-07 01:43:08.747646	f	9w8rCpdabgLhDJbdHtGmSTDE
83	89	1	ebd88715-5e95-40b8-b799-eaefd9647580	2022-06-07 02:05:01.383518	2022-06-07 02:05:01.383518	f	vRr6s4axmtrCgDcEpvVBo2YN
84	90	1	f836be5d-a128-41df-a67e-b016eea7ec18	2022-06-07 02:05:52.365608	2022-06-07 02:05:52.365608	f	aCQc9DaBeEF68ZXr3XKrhgcD
85	91	1	2b2e50a1-2bd0-4623-be36-1cdcb21f7160	2022-06-07 03:48:40.504049	2022-06-07 03:48:40.504049	f	aC9m9HkkmLMDJYJ6QYUYLtjp
86	56	1	ba3403f8-448b-4586-b68f-7336166a1cf1	2022-06-07 03:48:41.20384	2022-06-07 03:49:15.193514	f	cvQeJiMHhCSWX2ha3kvi6c53
87	93	1	18f2f1fd-a04f-4091-acd8-f9c810ab5f3d	2022-06-07 07:14:06.057224	2022-06-07 07:14:06.057224	f	Hd84qZhujLbR4raYs72bELCd
88	94	1	f20397ef-cc05-4342-bf1d-9509a1ec54b9	2022-06-07 07:17:21.088461	2022-06-07 07:17:21.088461	f	yXjKi3e8QJ6UN2sYiifCWQFT
89	95	1	e92f3426-31ea-4634-99bc-e3ab2bc907a3	2022-06-07 07:17:21.820696	2022-06-07 07:17:21.820696	f	8jvcpiej1nACU7bkD3xA8XqW
90	96	1	4e8d842b-c66a-42d7-ac6a-85aabf949c4e	2022-06-07 07:18:12.376075	2022-06-07 07:18:12.376075	f	yisDsQ35TkqVNiHCDyYh4G3k
91	97	1	d9319530-6e23-441e-b961-dfb974dab624	2022-06-07 07:18:12.945251	2022-06-07 07:18:12.945251	f	LwWCKDWUm4Draqbuaq2rmQj6
92	98	1	f5feb16c-fc29-451b-8322-d7f2e824725e	2022-06-07 07:19:08.315535	2022-06-07 07:19:08.315535	f	wXtin6dtUm7zpE6h8jXTst9m
93	99	1	76d14e87-c86d-48be-998f-a69a127714c5	2022-06-07 07:19:24.938675	2022-06-07 07:19:24.938675	f	sLEopGbyte92FiqeJBn1PChJ
94	100	1	f4002dfd-eb05-486b-b8a3-c94f1d9b0f71	2022-06-07 07:20:07.612229	2022-06-07 07:20:07.612229	f	EiATKieJpLbSm1Jgf3nVdwUA
95	101	1	8fc8941b-0569-49ad-860b-2c906500d94e	2022-06-07 07:20:16.733061	2022-06-07 07:20:16.733061	f	8ZFq2Qz92PCpTYmiwWWzjxSf
96	102	1	1bcc61bb-a689-4a9c-8aca-1a5ce53f93d3	2022-06-07 07:20:22.683478	2022-06-07 07:20:22.683478	f	cDfQHrZj9vytzzPmzXkSHM4K
97	103	1	835056ae-cd11-4241-bfdb-49fbd425b3fc	2022-06-07 07:21:16.675593	2022-06-07 07:21:16.675593	f	4Yt1cRqS2VibpzvfePLnJU9j
98	104	1	8623afd7-9dd0-4f03-953d-8c6c25762892	2022-06-07 07:21:18.064929	2022-06-07 07:21:18.064929	f	GiEgBmYAqYEvcVVm33GXSCEo
99	105	1	ee51d312-f4b8-4189-9002-d9430037f830	2022-06-07 07:50:22.46986	2022-06-07 07:50:22.46986	f	HqAJJ8GyYg7H63RrFxxZdp11
100	106	1	2cdf8276-8ac2-4bfa-9732-ab08d634c251	2022-06-07 07:50:24.203541	2022-06-07 07:50:24.203541	f	acyiEtJG78MhkAwphwhPJC5S
101	107	1	7ee393d5-1ce7-4631-a026-ad1c08ea3dbb	2022-06-07 08:23:40.359223	2022-06-07 08:23:40.359223	f	SwA3sc3LmRqBXG6dFABCYj3Z
102	108	1	d9ddff5e-d3a7-4005-9c68-612b2ca7aa59	2022-06-07 08:23:41.482595	2022-06-07 08:23:41.482595	f	5smwwxXUTSHPGmQpD3FPcPW1
103	80	1	42fec013-df93-449d-838f-b346af8fe288	2022-06-07 08:24:13.958624	2022-06-07 08:24:26.233376	f	7hDvo8bBT243uSuQQ3dJeEDr
104	110	1	e9c444cc-f570-472a-baa6-2a543befe291	2022-06-07 13:14:43.840224	2022-06-07 13:14:43.840224	f	vbAj4hvLyeMosXCa2vaWcwq1
105	111	1	3f057ed0-20e3-4560-8545-d0337e052f18	2022-06-07 13:14:46.035189	2022-06-07 13:14:46.035189	f	K14qQS5oFoSNYXacYKUgbDmL
106	112	1	577a149f-cf32-4b3f-871c-501e2a39d5f4	2022-06-07 23:27:21.55786	2022-06-07 23:27:21.55786	f	GcEbqr6xQFFW2M8H2Aq9HFUm
107	113	1	598362b8-085a-4266-bbd2-da6ccc769f1d	2022-06-07 23:27:25.850049	2022-06-07 23:27:25.850049	f	Bzx6uoimHHE7jHk5LNJ9NHiM
108	114	1	df0397ea-8575-431d-98b3-14b60d8199e7	2022-06-07 23:30:22.872384	2022-06-07 23:30:22.872384	f	3KcWQ3ihtyQFxoEnE91nJ2BL
\.


--
-- TOC entry 4084 (class 0 OID 19889)
-- Dependencies: 264
-- Data for Name: contacts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.contacts (id, name, email, phone_number, account_id, created_at, updated_at, additional_attributes, identifier, custom_attributes, last_activity_at) FROM stdin;
1	silent-dream-64	\N	\N	1	2022-06-03 08:44:15.527932	2022-06-03 08:44:15.527932	{}	\N	{}	\N
3	icy-field-66	\N	\N	1	2022-06-03 09:35:43.260646	2022-06-03 09:35:43.260646	{}	\N	{}	\N
2	young-butterfly-979	\N	\N	1	2022-06-03 09:35:14.841481	2022-06-03 09:36:03.963355	{}	\N	{}	2022-06-03 09:36:03.941831
5	nameless-meadow-133	\N	\N	1	2022-06-03 14:11:51.512262	2022-06-03 14:11:51.512262	{}	\N	{}	\N
6	autumn-forest-505	\N	\N	1	2022-06-03 14:11:52.717495	2022-06-03 14:11:52.717495	{}	\N	{}	\N
8	wild-lake-406	\N	\N	1	2022-06-03 14:15:40.977116	2022-06-03 14:15:40.977116	{}	\N	{}	\N
7	fragrant-breeze-93	\N	\N	1	2022-06-03 14:11:56.566803	2022-06-03 14:20:22.960537	{}	\N	{}	2022-06-03 14:20:22.953463
9	summer-log-980	\N	\N	1	2022-06-03 15:25:54.54285	2022-06-03 15:25:54.54285	{}	\N	{}	\N
10	summer-star-302	\N	\N	1	2022-06-03 15:25:56.092999	2022-06-03 15:25:56.092999	{}	\N	{}	\N
64	bitter-shadow-949	\N	\N	1	2022-06-06 05:59:55.653906	2022-06-06 05:59:55.653906	{}	\N	{}	\N
13	old-violet-786	\N	\N	1	2022-06-03 23:47:24.851253	2022-06-03 23:47:24.851253	{}	\N	{}	\N
12	proud-cloud-419	\N	\N	1	2022-06-03 23:47:23.218918	2022-06-03 23:49:13.010231	{}	\N	{}	2022-06-03 23:49:13.003326
14	fragrant-thunder-126	\N	\N	1	2022-06-04 06:16:44.704408	2022-06-04 06:16:44.704408	{}	\N	{}	\N
15	quiet-leaf-281	\N	\N	1	2022-06-04 07:15:52.541311	2022-06-04 07:15:52.541311	{}	\N	{}	\N
16	crimson-sky-112	\N	\N	1	2022-06-04 07:15:53.584494	2022-06-04 07:15:53.584494	{}	\N	{}	\N
17	crimson-pond-364	\N	\N	1	2022-06-04 07:25:36.57209	2022-06-04 07:25:36.57209	{}	\N	{}	\N
44	old-snow-227	\N	\N	1	2022-06-06 02:50:50.201674	2022-06-06 02:50:50.201674	{}	\N	{}	\N
65	aged-flower-447	\N	\N	1	2022-06-06 06:00:40.041568	2022-06-06 06:00:40.041568	{}	\N	{}	\N
19	thrumming-butterfly-529	\N	\N	1	2022-06-04 09:15:57.72734	2022-06-04 09:15:57.72734	{}	\N	{}	\N
20	quiet-night-406	\N	\N	1	2022-06-04 09:16:00.899751	2022-06-04 09:16:00.899751	{}	\N	{}	\N
22	lively-sky-996	\N	\N	1	2022-06-06 00:04:12.818798	2022-06-06 00:04:12.818798	{}	\N	{}	\N
21	patient-dust-785	\N	\N	1	2022-06-06 00:01:22.321734	2022-06-06 00:16:01.237788	{}	\N	{}	2022-06-06 00:16:01.232474
23	Landon test contact	\N		1	2022-06-06 00:35:47.133918	2022-06-06 00:35:47.133918	{"description": "", "company_name": "", "social_profiles": {"github": "", "twitter": "", "facebook": "", "linkedin": ""}}	\N	{}	\N
45	misty-flower-701	\N	\N	1	2022-06-06 02:51:47.862636	2022-06-06 02:51:47.862636	{}	\N	{}	\N
28	silent-pond-10	\N	\N	1	2022-06-06 02:07:59.633023	2022-06-06 02:07:59.633023	{}	\N	{}	\N
29	long-resonance-98	\N	\N	1	2022-06-06 02:08:00.476028	2022-06-06 02:08:00.476028	{}	\N	{}	\N
68	aged-fire-63	\N	\N	1	2022-06-06 07:41:16.887385	2022-06-06 07:41:16.887385	{}	\N	{}	\N
69	white-frost-859	\N	\N	1	2022-06-06 07:41:17.7048	2022-06-06 07:41:17.7048	{}	\N	{}	\N
31	fragrant-darkness-890	\N	\N	1	2022-06-06 02:11:45.481739	2022-06-06 02:11:45.481739	{}	\N	{}	\N
47	hidden-water-517	\N	\N	1	2022-06-06 03:10:04.563082	2022-06-06 03:10:04.563082	{}	\N	{}	\N
33	fragrant-sun-882	\N	\N	1	2022-06-06 02:14:16.316776	2022-06-06 02:14:16.316776	{}	\N	{}	\N
34	rough-rain-917	\N	\N	1	2022-06-06 02:18:07.389882	2022-06-06 02:18:07.389882	{}	\N	{}	\N
35	floral-mountain-163	\N	\N	1	2022-06-06 02:19:58.084096	2022-06-06 02:19:58.084096	{}	\N	{}	\N
37	lively-thunder-280	\N	\N	1	2022-06-06 02:24:39.462551	2022-06-06 02:24:39.462551	{}	\N	{}	\N
39	late-sun-801	\N	\N	1	2022-06-06 02:44:59.621728	2022-06-06 02:44:59.621728	{}	\N	{}	\N
40	divine-violet-546	\N	\N	1	2022-06-06 02:45:05.151915	2022-06-06 02:45:05.151915	{}	\N	{}	\N
54	wispy-wildflower-614	\N	\N	1	2022-06-06 04:23:25.635133	2022-06-06 04:23:25.635133	{}	\N	{}	\N
70	proud-star-361	\N	\N	1	2022-06-06 07:45:37.834565	2022-06-06 07:45:37.834565	{}	\N	{}	\N
42	young-sound-441	\N	\N	1	2022-06-06 02:47:24.768168	2022-06-06 02:47:24.768168	{}	\N	{}	\N
55	polished-fire-566	\N	\N	1	2022-06-06 04:23:26.74222	2022-06-06 04:23:26.74222	{}	\N	{}	\N
49	solitary-wildflower-737	\N	\N	1	2022-06-06 03:25:32.809281	2022-06-06 03:25:32.809281	{}	\N	{}	\N
50	small-rain-544	\N	\N	1	2022-06-06 03:25:39.136839	2022-06-06 03:25:39.136839	{}	\N	{}	\N
103	late-water-162	\N	\N	1	2022-06-07 07:21:16.616493	2022-06-07 07:41:33.540067	{}	\N	{"type_message": "Bug"}	\N
57	damp-cloud-284	\N	\N	1	2022-06-06 04:31:02.584424	2022-06-06 04:31:02.584424	{}	\N	{}	\N
58	small-butterfly-655	\N	\N	1	2022-06-06 04:31:03.409561	2022-06-06 04:31:03.409561	{}	\N	{}	\N
59	small-resonance-919	\N	\N	1	2022-06-06 04:31:14.816249	2022-06-06 04:31:14.816249	{}	\N	{}	\N
60	hidden-rain-262	\N	\N	1	2022-06-06 04:31:15.870313	2022-06-06 04:31:15.870313	{}	\N	{}	\N
71	shy-star-614	\N	\N	1	2022-06-06 08:22:09.49092	2022-06-06 08:22:09.49092	{}	\N	{}	\N
93	morning-fog-587	\N	\N	1	2022-06-07 07:14:06.020405	2022-06-07 07:14:06.020405	{}	\N	{}	\N
72	winter-dawn-223	\N	\N	1	2022-06-06 08:22:11.170872	2022-06-06 08:22:11.170872	{}	\N	{}	\N
61	falling-cloud-905	\N	\N	1	2022-06-06 05:56:50.691341	2022-06-06 05:56:50.691341	{}	\N	{}	\N
74	snowy-firefly-94	\N	\N	1	2022-06-06 08:42:09.218576	2022-06-06 08:42:09.218576	{}	\N	{}	\N
63	little-haze-922	\N	\N	1	2022-06-06 05:59:54.506316	2022-06-06 05:59:54.506316	{}	\N	{}	\N
75	wild-pine-58	\N	\N	1	2022-06-06 09:19:22.281648	2022-06-06 09:19:22.281648	{}	\N	{}	\N
77	weathered-voice-606	\N	\N	1	2022-06-06 09:23:19.936936	2022-06-06 09:23:19.936936	{}	\N	{}	\N
78	fragrant-lake-927	\N	\N	1	2022-06-06 09:23:56.135139	2022-06-06 09:23:56.135139	{}	\N	{}	\N
86	rough-forest-172	\N	\N	1	2022-06-07 00:51:13.398081	2022-06-07 00:51:13.398081	{}	\N	{}	\N
83	crimson-lake-186	\N	\N	1	2022-06-06 09:39:08.206044	2022-06-06 09:39:08.206044	{}	\N	{}	\N
84	dawn-snowflake-941	\N	\N	1	2022-06-07 00:28:12.015314	2022-06-07 00:28:12.015314	{}	\N	{}	\N
87	dry-glade-280	\N	\N	1	2022-06-07 01:36:33.140174	2022-06-07 01:36:33.140174	{}	\N	{}	\N
89	aged-wind-738	\N	\N	1	2022-06-07 02:05:01.351518	2022-06-07 02:05:01.351518	{}	\N	{}	\N
90	silent-thunder-203	\N	\N	1	2022-06-07 02:05:52.341399	2022-06-07 02:05:52.341399	{}	\N	{}	\N
94	old-field-510	\N	\N	1	2022-06-07 07:17:21.066347	2022-06-07 07:17:21.066347	{}	\N	{}	\N
91	divine-dew-586	\N	\N	1	2022-06-07 03:48:40.484858	2022-06-07 03:48:40.484858	{}	\N	{}	\N
95	floral-waterfall-912	\N	\N	1	2022-06-07 07:17:21.796003	2022-06-07 07:17:21.796003	{}	\N	{}	\N
56	contact	contact@gmail.com		1	2022-06-06 04:26:42.295891	2022-06-08 01:42:52.859176	{"description": "no Bio", "company_name": "", "social_profiles": {"github": "", "twitter": "", "facebook": "", "linkedin": ""}}	\N	{}	2022-06-08 01:42:52.847311
96	small-flower-543	\N	\N	1	2022-06-07 07:18:12.357799	2022-06-07 07:18:12.357799	{}	\N	{}	\N
97	polished-firefly-56	\N	\N	1	2022-06-07 07:18:12.934151	2022-06-07 07:18:12.934151	{}	\N	{}	\N
98	polished-firefly-482	\N	\N	1	2022-06-07 07:19:08.296116	2022-06-07 07:19:08.296116	{}	\N	{}	\N
99	white-water-613	\N	\N	1	2022-06-07 07:19:24.926494	2022-06-07 07:19:24.926494	{}	\N	{}	\N
100	twilight-sky-16	\N	\N	1	2022-06-07 07:20:07.508688	2022-06-07 07:20:07.508688	{}	\N	{}	\N
101	thrumming-dream-5	\N	\N	1	2022-06-07 07:20:16.701494	2022-06-07 07:20:16.701494	{}	\N	{}	\N
102	twilight-frost-570	\N	\N	1	2022-06-07 07:20:22.613484	2022-06-07 07:20:22.613484	{}	\N	{}	\N
104	summer-fire-946	\N	\N	1	2022-06-07 07:21:18.049413	2022-06-07 07:21:18.049413	{}	\N	{}	\N
73	frosty-morning-438	\N	\N	1	2022-06-06 08:42:07.825474	2022-06-07 07:40:54.857648	{}	\N	{"type_message": "Bug"}	\N
4	polished-sunset-626	hainguyenkt98@gmail.com	\N	1	2022-06-03 09:40:36.471466	2022-06-07 07:38:34.6221	{}	\N	{}	2022-06-07 07:38:34.595511
105	frosty-frog-213	\N	\N	1	2022-06-07 07:50:22.371583	2022-06-07 07:50:22.371583	{}	\N	{}	\N
106	patient-rain-331	\N	\N	1	2022-06-07 07:50:24.144437	2022-06-07 07:50:33.152656	{}	\N	{}	2022-06-07 07:50:33.137733
107	wild-meadow-632	\N	\N	1	2022-06-07 08:23:40.314845	2022-06-07 08:23:40.314845	{}	\N	{}	\N
108	twilight-sea-423	\N	\N	1	2022-06-07 08:23:41.462055	2022-06-07 08:24:00.514862	{}	\N	{}	2022-06-07 08:24:00.494349
80	landon	landon@gmail.com		1	2022-06-06 09:26:57.264905	2022-06-07 08:31:26.920615	{"description": "No bio", "company_name": "", "social_profiles": {"github": "", "twitter": "", "facebook": "", "linkedin": ""}}	\N	{"type_message": "Bug"}	2022-06-07 08:31:25.754379
110	falling-sun-948	\N	\N	1	2022-06-07 13:14:43.676512	2022-06-07 13:14:43.676512	{}	\N	{}	\N
111	wandering-shadow-983	\N	\N	1	2022-06-07 13:14:46.01646	2022-06-07 13:14:46.01646	{}	\N	{}	\N
112	wispy-dream-334	\N	\N	1	2022-06-07 23:27:21.473069	2022-06-07 23:27:21.473069	{}	\N	{}	\N
113	patient-thunder-744	\N	\N	1	2022-06-07 23:27:25.827996	2022-06-07 23:27:25.827996	{}	\N	{}	\N
114	polished-butterfly-192	\N	\N	1	2022-06-07 23:30:22.851209	2022-06-07 23:30:22.851209	{}	\N	{}	\N
\.


--
-- TOC entry 4086 (class 0 OID 19904)
-- Dependencies: 266
-- Data for Name: conversations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.conversations (id, account_id, inbox_id, status, assignee_id, created_at, updated_at, contact_id, display_id, contact_last_seen_at, agent_last_seen_at, additional_attributes, contact_inbox_id, uuid, identifier, last_activity_at, team_id, campaign_id, snoozed_until, custom_attributes, assignee_last_seen_at) FROM stdin;
30	1	1	0	1	2022-06-06 09:27:28.852654	2022-06-06 09:31:54.652848	80	30	2022-06-06 09:31:54.503266	2022-06-07 00:20:51.722265	{"browser": {"device_name": "Unknown", "browser_name": "Chrome", "platform_name": "Generic Linux", "browser_version": "95.0.4638.54", "platform_version": "0"}, "referer": "https://guardian.sye.vn/login", "initiated_at": {"timestamp": "Mon Jun 06 2022 02:27:44 GMT-0700 (Pacific Daylight Time)"}}	75	96b07973-649b-43c2-a49c-14b7d85a44ac	\N	2022-06-06 09:27:29.304369	\N	\N	\N	{"type_message": "Feedback"}	2022-06-07 00:20:51.729035
20	1	1	0	1	2022-06-06 05:47:04.328775	2022-06-08 01:42:52.916904	56	20	2022-06-08 01:42:52.906209	2022-06-08 01:41:37.00179	{"browser": {"device_name": "Unknown", "browser_name": "Chrome", "platform_name": "Generic Linux", "browser_version": "95.0.4638.54", "platform_version": "0"}, "referer": "https://app.sye.vn/", "initiated_at": {"timestamp": "Sun Jun 05 2022 22:47:20 GMT-0700 (Pacific Daylight Time)"}}	49	cf7d9962-ae59-4b4f-963c-ac0b3c84b0e1	\N	2022-06-08 01:42:52.790824	2	\N	\N	{}	2022-06-08 01:41:37.014613
24	1	1	1	1	2022-06-06 08:21:37.512648	2022-06-06 08:21:41.937113	70	24	2022-06-06 08:21:39.295953	2022-06-07 01:09:11.391618	{"browser": {"device_name": "Unknown", "browser_name": "Chrome", "platform_name": "Generic Linux", "browser_version": "95.0.4638.54", "platform_version": "0"}, "referer": "https://app.sye.vn/", "initiated_at": {"timestamp": "Mon Jun 06 2022 01:21:53 GMT-0700 (Pacific Daylight Time)"}, "widget_language": null, "browser_language": "en"}	65	076fe8af-cf5d-465e-a37f-cb0d58604e16	\N	2022-06-06 08:21:41.92674	\N	\N	\N	{"type_message": "Bug"}	2022-06-07 01:09:11.400328
19	1	1	0	1	2022-06-06 04:30:35.347446	2022-06-07 07:42:23.966362	4	19	2022-06-07 07:42:23.947972	2022-06-07 07:57:36.871856	{"browser": {"device_name": "Unknown", "browser_name": "Chrome", "platform_name": "Generic Linux", "browser_version": "101.0.4951.54", "platform_version": "0"}, "referer": "https://app.sye.vn/", "initiated_at": {"timestamp": "Mon Jun 06 2022 11:30:51 GMT+0700 (Indochina Time)"}, "widget_language": null, "browser_language": "en"}	4	a61ea72c-222e-4814-acfb-baa6532f5871	\N	2022-06-07 07:38:34.496548	2	\N	\N	{}	2022-06-07 07:54:28.99227
31	1	1	1	1	2022-06-06 23:57:09.842913	2022-06-07 00:04:35.953983	80	31	2022-06-07 00:04:35.9462	2022-06-07 01:09:10.600175	{"browser": {"device_name": "Unknown", "browser_name": "Chrome", "platform_name": "Generic Linux", "browser_version": "95.0.4638.54", "platform_version": "0"}, "referer": "https://guardian.sye.vn/login", "initiated_at": {"timestamp": "Mon Jun 06 2022 16:57:25 GMT-0700 (Pacific Daylight Time)"}}	76	53f5746b-f622-4111-8a8a-21048697ff99	\N	2022-06-07 00:04:12.789446	\N	\N	\N	{}	2022-06-07 01:09:10.608044
33	1	1	1	1	2022-06-07 00:10:39.912117	2022-06-07 00:11:55.227081	80	33	2022-06-07 00:10:41.781996	2022-06-07 01:43:13.139047	{"browser": {"device_name": "Unknown", "browser_name": "Chrome", "platform_name": "Generic Linux", "browser_version": "95.0.4638.54", "platform_version": "0"}, "referer": "https://guardian.sye.vn/login", "initiated_at": {"timestamp": "Mon Jun 06 2022 17:10:56 GMT-0700 (Pacific Daylight Time)"}}	76	161f8b0c-4dc2-4d91-acfc-4b810002d4a6	\N	2022-06-07 00:11:55.204558	\N	\N	\N	{}	2022-06-07 01:43:13.147222
34	1	1	0	1	2022-06-07 00:12:11.20716	2022-06-07 00:27:51.646183	80	34	2022-06-07 00:27:51.63604	2022-06-07 07:39:11.772588	{"browser": {"device_name": "Unknown", "browser_name": "Chrome", "platform_name": "Generic Linux", "browser_version": "95.0.4638.54", "platform_version": "0"}, "referer": "https://guardian.sye.vn/login", "initiated_at": {"timestamp": "Mon Jun 06 2022 17:12:27 GMT-0700 (Pacific Daylight Time)"}}	76	3f20a918-9c7e-4592-99a2-917d7c2ef8dd	\N	2022-06-07 00:27:34.497425	2	\N	\N	{}	2022-06-07 01:44:47.197599
32	1	1	1	1	2022-06-07 00:04:48.855104	2022-06-07 00:10:26.481987	80	32	2022-06-07 00:04:50.360844	2022-06-07 01:09:13.724231	{"browser": {"device_name": "Unknown", "browser_name": "Chrome", "platform_name": "Generic Linux", "browser_version": "95.0.4638.54", "platform_version": "0"}, "referer": "https://guardian.sye.vn/login", "initiated_at": {"timestamp": "Mon Jun 06 2022 17:05:05 GMT-0700 (Pacific Daylight Time)"}}	76	63dad269-3403-487d-8179-c4057bd8cad5	\N	2022-06-07 00:10:26.425694	\N	\N	\N	{}	2022-06-07 01:09:13.740606
35	1	1	0	1	2022-06-07 00:28:35.441607	2022-06-07 00:28:59.918279	80	35	2022-06-07 00:28:59.91271	2022-06-07 01:45:20.170045	{"browser": {"device_name": "Unknown", "browser_name": "Chrome", "platform_name": "Generic Linux", "browser_version": "95.0.4638.54", "platform_version": "0"}, "referer": "https://guardian.sye.vn/login", "initiated_at": {"timestamp": "Mon Jun 06 2022 17:28:51 GMT-0700 (Pacific Daylight Time)"}}	79	4ee7e71f-29c9-473d-be14-0d13cb523363	\N	2022-06-07 00:28:59.492541	2	\N	\N	{}	2022-06-07 01:45:20.196431
36	1	1	0	1	2022-06-07 01:43:08.874611	2022-06-07 01:43:20.820208	80	36	2022-06-07 01:43:20.812041	2022-06-07 07:39:09.235633	{"browser": {"device_name": "Unknown", "browser_name": "Chrome", "platform_name": "Generic Linux", "browser_version": "95.0.4638.54", "platform_version": "0"}, "referer": "https://guardian.sye.vn/login", "initiated_at": {"timestamp": "Mon Jun 06 2022 18:43:25 GMT-0700 (Pacific Daylight Time)"}}	82	771a976e-c525-45ae-8c9c-10d4762f6ad4	\N	2022-06-07 01:43:20.728943	\N	\N	\N	{}	2022-06-07 07:39:09.249242
6	1	1	0	1	2022-06-06 00:16:00.638539	2022-06-06 00:16:02.266198	21	6	2022-06-06 00:16:02.259035	2022-06-06 08:02:43.474517	{"browser": {"device_name": "Unknown", "browser_name": "Chrome", "platform_name": "Generic Linux", "browser_version": "101.0.0.0", "platform_version": "0"}, "referer": "https://app.els.com/", "initiated_at": {"timestamp": "Sun Jun 05 2022 17:16:16 GMT-0700 (Pacific Daylight Time)"}}	21	dfb18294-dfda-486d-9162-b7b5f8eeeebf	\N	2022-06-06 00:16:01.118068	\N	\N	\N	{}	\N
2	1	1	0	1	2022-06-03 14:20:21.503944	2022-06-05 15:59:44.176215	7	2	2022-06-05 15:59:44.160291	2022-06-06 08:02:47.966412	{"browser": {"device_name": "Unknown", "browser_name": "Chrome", "platform_name": "Windows", "browser_version": "102.0.5005.63", "platform_version": "10.0"}, "referer": "https://app.sye.vn/", "initiated_at": {"timestamp": "Fri Jun 03 2022 21:20:36 GMT+0700 (Indochina Time)"}}	7	24d1efa4-89f2-4c7d-af7d-32354ab78d07	\N	2022-06-03 14:20:22.800877	\N	\N	\N	{}	2022-06-03 15:28:41.929178
1	1	1	0	1	2022-06-03 09:36:01.553171	2022-06-03 14:08:53.48102	2	1	2022-06-03 09:37:21.628669	2022-06-06 08:02:49.485665	{"browser": {"device_name": "Unknown", "browser_name": "Chrome", "platform_name": "Generic Linux", "browser_version": "101.0.4951.54", "platform_version": "0"}, "referer": "https://guardian.sye.vn/login", "initiated_at": {"timestamp": "Fri Jun 03 2022 16:36:16 GMT+0700 (Indochina Time)"}}	2	2afb1d04-ba0d-43bd-a93f-90e71159496d	\N	2022-06-03 14:08:53.475775	\N	\N	\N	{}	2022-06-03 15:27:24.144477
4	1	1	0	1	2022-06-03 23:49:12.206685	2022-06-03 23:51:34.485407	12	4	2022-06-03 23:51:34.455068	2022-06-06 09:18:34.875428	{"browser": {"device_name": "Unknown", "browser_name": "Chrome", "platform_name": "Generic Linux", "browser_version": "98.0.4758.102", "platform_version": "0"}, "referer": "https://app.sye.vn/", "initiated_at": {"timestamp": "Fri Jun 03 2022 16:49:27 GMT-0700 (Pacific Daylight Time)"}}	12	c7dbeeba-806a-4fff-9144-0a64a0124fd8	\N	2022-06-03 23:49:12.857682	\N	\N	\N	{}	2022-06-03 23:49:27.39946
37	1	1	0	1	2022-06-07 03:49:15.354364	2022-06-07 03:49:19.22622	56	37	2022-06-07 03:49:19.219158	2022-06-07 07:39:05.975424	{"browser": {"device_name": "Unknown", "browser_name": "Chrome", "platform_name": "Generic Linux", "browser_version": "95.0.4638.54", "platform_version": "0"}, "referer": "https://guardian.sye.vn/login", "initiated_at": {"timestamp": "Mon Jun 06 2022 20:49:31 GMT-0700 (Pacific Daylight Time)"}}	86	47628af6-d140-47dc-9136-84e3507ca744	\N	2022-06-07 03:49:15.717415	\N	\N	\N	{}	2022-06-07 07:39:05.998743
39	1	1	0	1	2022-06-07 08:23:59.51646	2022-06-07 08:24:00.916636	108	39	2022-06-07 08:24:00.91131	2022-06-08 00:09:41.589957	{"browser": {"device_name": "Unknown", "browser_name": "Chrome", "platform_name": "Generic Linux", "browser_version": "95.0.4638.54", "platform_version": "0"}, "referer": "https://guardian.sye.vn/login", "initiated_at": {"timestamp": "Tue Jun 07 2022 01:24:15 GMT-0700 (Pacific Daylight Time)"}}	102	44651942-91d1-43e9-8e7e-1f3a8b88bea2	\N	2022-06-07 08:24:00.313541	\N	\N	\N	{}	2022-06-08 00:09:41.602073
38	1	1	0	1	2022-06-07 07:50:32.077079	2022-06-07 07:50:33.877059	106	38	2022-06-07 07:50:33.83596	2022-06-07 07:57:37.976997	{"browser": {"device_name": "Unknown", "browser_name": "Chrome", "platform_name": "Generic Linux", "browser_version": "95.0.4638.54", "platform_version": "0"}, "referer": "https://guardian.sye.vn/login", "initiated_at": {"timestamp": "Tue Jun 07 2022 00:50:48 GMT-0700 (Pacific Daylight Time)"}}	100	5d159644-e02b-488b-b758-fa2d6d69eec6	\N	2022-06-07 07:50:32.877461	\N	\N	\N	{}	2022-06-07 07:54:23.388762
40	1	1	0	1	2022-06-07 08:24:19.711337	2022-06-07 08:31:40.395852	80	40	2022-06-07 08:31:25.79848	2022-06-08 00:09:42.755253	{"browser": {"device_name": "Unknown", "browser_name": "Chrome", "platform_name": "Generic Linux", "browser_version": "95.0.4638.54", "platform_version": "0"}, "referer": "https://guardian.sye.vn/login", "initiated_at": {"timestamp": "Tue Jun 07 2022 01:24:36 GMT-0700 (Pacific Daylight Time)"}}	103	727596ab-c8c9-4be1-a67d-0a1d9425cbf7	\N	2022-06-07 08:31:18.859861	2	\N	\N	{}	2022-06-08 00:09:42.774073
\.


--
-- TOC entry 4088 (class 0 OID 19926)
-- Dependencies: 268
-- Data for Name: csat_survey_responses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.csat_survey_responses (id, account_id, conversation_id, message_id, rating, feedback_message, contact_id, assigned_agent_id, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 4090 (class 0 OID 19940)
-- Dependencies: 270
-- Data for Name: custom_attribute_definitions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.custom_attribute_definitions (id, attribute_display_name, attribute_key, attribute_display_type, default_value, attribute_model, account_id, created_at, updated_at, attribute_description, attribute_values) FROM stdin;
2	Type Message	type_message	6	\N	1	1	2022-06-06 09:30:14.03047	2022-06-06 09:30:14.03047	chọn type message	["Bug", "Request"]
\.


--
-- TOC entry 4092 (class 0 OID 19954)
-- Dependencies: 272
-- Data for Name: custom_filters; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.custom_filters (id, name, filter_type, query, account_id, user_id, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 4094 (class 0 OID 19967)
-- Dependencies: 274
-- Data for Name: data_imports; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.data_imports (id, account_id, data_type, status, processing_errors, total_records, processed_records, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 4096 (class 0 OID 19978)
-- Dependencies: 276
-- Data for Name: email_templates; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.email_templates (id, name, body, account_id, template_type, locale, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 4098 (class 0 OID 19990)
-- Dependencies: 278
-- Data for Name: inbox_members; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.inbox_members (id, user_id, inbox_id, created_at, updated_at) FROM stdin;
1	1	1	2022-06-03 07:54:00.951493	2022-06-03 07:54:00.951493
\.


--
-- TOC entry 4100 (class 0 OID 19999)
-- Dependencies: 280
-- Data for Name: inboxes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.inboxes (id, channel_id, account_id, name, created_at, updated_at, channel_type, enable_auto_assignment, greeting_enabled, greeting_message, email_address, working_hours_enabled, out_of_office_message, timezone, enable_email_collect, csat_survey_enabled, allow_messages_after_resolved) FROM stdin;
1	1	1	Yummy English	2022-06-03 07:53:51.339487	2022-06-07 07:12:48.072737	Channel::WebWidget	t	t	Hello, welcome to Yummy English!	\N	f	\N	UTC	t	f	t
\.


--
-- TOC entry 4102 (class 0 OID 20016)
-- Dependencies: 282
-- Data for Name: installation_configs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.installation_configs (id, name, serialized_value, created_at, updated_at, locked) FROM stdin;
1	INSTALLATION_NAME	"--- !ruby/hash:ActiveSupport::HashWithIndifferentAccess\\nvalue: Chatwoot\\n"	2022-06-03 06:56:26.512033	2022-06-03 06:56:26.572243	t
2	LOGO_THUMBNAIL	"--- !ruby/hash:ActiveSupport::HashWithIndifferentAccess\\nvalue: \\"/brand-assets/logo_thumbnail.svg\\"\\n"	2022-06-03 06:56:26.613222	2022-06-03 06:56:26.635117	t
3	LOGO	"--- !ruby/hash:ActiveSupport::HashWithIndifferentAccess\\nvalue: \\"/brand-assets/logo.svg\\"\\n"	2022-06-03 06:56:26.655423	2022-06-03 06:56:26.67126	t
4	BRAND_URL	"--- !ruby/hash:ActiveSupport::HashWithIndifferentAccess\\nvalue: https://www.chatwoot.com\\n"	2022-06-03 06:56:26.694539	2022-06-03 06:56:26.741849	t
5	WIDGET_BRAND_URL	"--- !ruby/hash:ActiveSupport::HashWithIndifferentAccess\\nvalue: https://www.chatwoot.com\\n"	2022-06-03 06:56:26.774066	2022-06-03 06:56:26.792827	t
6	BRAND_NAME	"--- !ruby/hash:ActiveSupport::HashWithIndifferentAccess\\nvalue: Chatwoot\\n"	2022-06-03 06:56:26.855875	2022-06-03 06:56:26.877657	t
7	TERMS_URL	"--- !ruby/hash:ActiveSupport::HashWithIndifferentAccess\\nvalue: https://www.chatwoot.com/terms-of-service\\n"	2022-06-03 06:56:26.910294	2022-06-03 06:56:26.922275	t
8	PRIVACY_URL	"--- !ruby/hash:ActiveSupport::HashWithIndifferentAccess\\nvalue: https://www.chatwoot.com/privacy-policy\\n"	2022-06-03 06:56:27.09082	2022-06-03 06:56:27.170886	t
9	DISPLAY_MANIFEST	"--- !ruby/hash:ActiveSupport::HashWithIndifferentAccess\\nvalue: true\\n"	2022-06-03 06:56:27.214434	2022-06-03 06:56:27.747298	t
10	MAILER_INBOUND_EMAIL_DOMAIN	"--- !ruby/hash:ActiveSupport::HashWithIndifferentAccess\\nvalue:\\n"	2022-06-03 06:56:27.782384	2022-06-03 06:56:27.798894	f
11	MAILER_SUPPORT_EMAIL	"--- !ruby/hash:ActiveSupport::HashWithIndifferentAccess\\nvalue:\\n"	2022-06-03 06:56:27.850297	2022-06-03 06:56:27.87078	f
12	CREATE_NEW_ACCOUNT_FROM_DASHBOARD	"--- !ruby/hash:ActiveSupport::HashWithIndifferentAccess\\nvalue: false\\n"	2022-06-03 06:56:27.910678	2022-06-03 06:56:27.940928	f
13	INSTALLATION_EVENTS_WEBHOOK_URL	"--- !ruby/hash:ActiveSupport::HashWithIndifferentAccess\\nvalue:\\n"	2022-06-03 06:56:27.965878	2022-06-03 06:56:27.991517	f
14	CHATWOOT_INBOX_TOKEN	"--- !ruby/hash:ActiveSupport::HashWithIndifferentAccess\\nvalue:\\n"	2022-06-03 06:56:28.078706	2022-06-03 06:56:28.107011	f
15	CHATWOOT_INBOX_HMAC_KEY	"--- !ruby/hash:ActiveSupport::HashWithIndifferentAccess\\nvalue:\\n"	2022-06-03 06:56:28.150988	2022-06-03 06:56:28.164858	f
16	API_CHANNEL_NAME	"--- !ruby/hash:ActiveSupport::HashWithIndifferentAccess\\nvalue:\\n"	2022-06-03 06:56:28.190262	2022-06-03 06:56:28.205374	t
17	API_CHANNEL_THUMBNAIL	"--- !ruby/hash:ActiveSupport::HashWithIndifferentAccess\\nvalue:\\n"	2022-06-03 06:56:28.239041	2022-06-03 06:56:28.275675	t
18	ANALYTICS_TOKEN	"--- !ruby/hash:ActiveSupport::HashWithIndifferentAccess\\nvalue:\\n"	2022-06-03 06:56:28.344645	2022-06-03 06:56:28.363763	t
19	ANALYTICS_HOST	"--- !ruby/hash:ActiveSupport::HashWithIndifferentAccess\\nvalue:\\n"	2022-06-03 06:56:28.386272	2022-06-03 06:56:28.411477	t
20	DIRECT_UPLOADS_ENABLED	"--- !ruby/hash:ActiveSupport::HashWithIndifferentAccess\\nvalue: false\\n"	2022-06-03 06:56:28.452752	2022-06-03 06:56:28.464161	f
21	HCAPTCHA_SITE_KEY	"--- !ruby/hash:ActiveSupport::HashWithIndifferentAccess\\nvalue:\\n"	2022-06-03 06:56:28.485388	2022-06-03 06:56:28.501966	f
22	HCAPTCHA_SERVER_KEY	"--- !ruby/hash:ActiveSupport::HashWithIndifferentAccess\\nvalue:\\n"	2022-06-03 06:56:28.560639	2022-06-03 06:56:28.585488	f
23	LOGOUT_REDIRECT_LINK	"--- !ruby/hash:ActiveSupport::HashWithIndifferentAccess\\nvalue: \\"/app/login\\"\\n"	2022-06-03 06:56:28.619115	2022-06-03 06:56:28.645979	f
24	DISABLE_USER_PROFILE_UPDATE	"--- !ruby/hash:ActiveSupport::HashWithIndifferentAccess\\nvalue: false\\n"	2022-06-03 06:56:28.670303	2022-06-03 06:56:28.68551	f
25	ACCOUNT_LEVEL_FEATURE_DEFAULTS	"--- !ruby/hash:ActiveSupport::HashWithIndifferentAccess\\nvalue:\\n- !ruby/hash:ActiveSupport::HashWithIndifferentAccess\\n  name: inbound_emails\\n  enabled: true\\n- !ruby/hash:ActiveSupport::HashWithIndifferentAccess\\n  name: channel_email\\n  enabled: true\\n- !ruby/hash:ActiveSupport::HashWithIndifferentAccess\\n  name: channel_facebook\\n  enabled: true\\n- !ruby/hash:ActiveSupport::HashWithIndifferentAccess\\n  name: channel_twitter\\n  enabled: true\\n- !ruby/hash:ActiveSupport::HashWithIndifferentAccess\\n  name: ip_lookup\\n  enabled: false\\n"	2022-06-03 06:56:28.735675	2022-06-03 06:56:28.747461	t
26	VAPID_KEYS	"--- !ruby/hash:ActiveSupport::HashWithIndifferentAccess\\nvalue: !ruby/hash:ActiveSupport::HashWithIndifferentAccess\\n  public_key: BOgI1xLAGzLFHG3hyu6qPGZ9VFCXY7hqw41sCklOKWWUnSkH3MUhnMB8cdf9pCKd8-KbqvpEw4Zg-7PRiXVgcD4=\\n  private_key: DvMmUJeJNwgHCQoZ7hWy0ouoZFmPojAsU_Y6B-6y8ic=\\n"	2022-06-03 07:00:38.188795	2022-06-03 07:00:38.188795	t
27	INSTALLATION_IDENTIFIER	"--- !ruby/hash:ActiveSupport::HashWithIndifferentAccess\\nvalue: 00cea70b-d3b9-4ffc-88b0-28bd2ffebe03\\n"	2022-06-03 12:00:05.496234	2022-06-03 12:00:05.496234	t
\.


--
-- TOC entry 4104 (class 0 OID 20029)
-- Dependencies: 284
-- Data for Name: integrations_hooks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.integrations_hooks (id, status, inbox_id, account_id, app_id, hook_type, reference_id, access_token, created_at, updated_at, settings) FROM stdin;
\.


--
-- TOC entry 4106 (class 0 OID 20041)
-- Dependencies: 286
-- Data for Name: kbase_articles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.kbase_articles (id, account_id, portal_id, category_id, folder_id, author_id, title, description, content, status, views, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 4108 (class 0 OID 20050)
-- Dependencies: 288
-- Data for Name: kbase_categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.kbase_categories (id, account_id, portal_id, name, description, "position", created_at, updated_at, locale) FROM stdin;
\.


--
-- TOC entry 4110 (class 0 OID 20061)
-- Dependencies: 290
-- Data for Name: kbase_folders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.kbase_folders (id, account_id, category_id, name, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 4112 (class 0 OID 20070)
-- Dependencies: 292
-- Data for Name: kbase_portals; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.kbase_portals (id, account_id, name, slug, custom_domain, color, homepage_link, page_title, header_text, created_at, updated_at, config) FROM stdin;
\.


--
-- TOC entry 4114 (class 0 OID 20081)
-- Dependencies: 294
-- Data for Name: labels; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.labels (id, title, description, color, show_on_sidebar, account_id, created_at, updated_at) FROM stdin;
1	bug		#F30014	t	1	2022-06-03 09:22:30.8523	2022-06-03 09:22:30.8523
2	request		#E8610E	t	1	2022-06-03 09:22:52.838155	2022-06-03 09:22:52.838155
3	feedback		#E0D23F	t	1	2022-06-03 09:23:32.08352	2022-06-03 09:23:32.08352
\.


--
-- TOC entry 4116 (class 0 OID 20093)
-- Dependencies: 296
-- Data for Name: mentions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.mentions (id, user_id, conversation_id, account_id, mentioned_at, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 4118 (class 0 OID 20104)
-- Dependencies: 298
-- Data for Name: messages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.messages (id, content, account_id, inbox_id, conversation_id, message_type, created_at, updated_at, private, status, source_id, content_type, content_attributes, sender_type, sender_id, external_source_ids, additional_attributes) FROM stdin;
1	Hello	1	1	1	0	2022-06-03 09:36:01.877791	2022-06-03 09:36:01.877791	f	0	\N	0	{}	Contact	2	{}	{}
2	Hello, welcome to Yummi English!	1	1	1	3	2022-06-03 09:36:02.992588	2022-06-03 09:36:02.992588	f	0	\N	0	{}	\N	\N	{}	{}
3	Give the team a way to reach you.	1	1	1	3	2022-06-03 09:36:03.430835	2022-06-03 09:36:03.430835	f	0	\N	0	{}	\N	\N	{}	{}
4	Get notified by email	1	1	1	3	2022-06-03 09:36:03.501927	2022-06-03 09:36:03.501927	f	0	\N	3	{}	\N	\N	{}	{}
5	Hi, this is justin	1	1	1	1	2022-06-03 09:36:27.495272	2022-06-03 09:36:27.495272	f	0	\N	0	\N	User	1	{}	{}
6	Private note 1	1	1	1	1	2022-06-03 14:08:02.57204	2022-06-03 14:08:02.57204	t	0	\N	0	\N	User	1	{}	{}
7	Assigned to customer service by PHP Software Team	1	1	1	2	2022-06-03 14:08:22.450561	2022-06-03 14:08:22.450561	f	0	\N	0	{}	\N	\N	{}	{}
8	Unassigned from customer service by PHP Software Team	1	1	1	2	2022-06-03 14:08:26.228462	2022-06-03 14:08:26.228462	f	0	\N	0	{}	\N	\N	{}	{}
9	Conversation unassigned by PHP Software Team	1	1	1	2	2022-06-03 14:08:35.568881	2022-06-03 14:08:35.568881	f	0	\N	0	{}	\N	\N	{}	{}
10	PHP Software Team self-assigned this conversation	1	1	1	2	2022-06-03 14:08:36.941964	2022-06-03 14:08:36.941964	f	0	\N	0	{}	\N	\N	{}	{}
11	Conversation unassigned by PHP Software Team	1	1	1	2	2022-06-03 14:08:41.003816	2022-06-03 14:08:41.003816	f	0	\N	0	{}	\N	\N	{}	{}
12	Assigned to PHP Software Team via customer service by PHP Software Team	1	1	1	2	2022-06-03 14:08:51.718517	2022-06-03 14:08:51.718517	f	0	\N	0	{}	\N	\N	{}	{}
13	Unassigned from customer service by PHP Software Team	1	1	1	2	2022-06-03 14:08:53.475775	2022-06-03 14:08:53.475775	f	0	\N	0	{}	\N	\N	{}	{}
14	\N	1	1	2	0	2022-06-03 14:20:21.821195	2022-06-03 14:20:21.821195	f	0	\N	0	{}	Contact	7	{}	{}
15	Hello, welcome to Yummi English!	1	1	2	3	2022-06-03 14:20:22.535207	2022-06-03 14:20:22.535207	f	0	\N	0	{}	\N	\N	{}	{}
16	Give the team a way to reach you.	1	1	2	3	2022-06-03 14:20:22.755105	2022-06-03 14:20:22.755105	f	0	\N	0	{}	\N	\N	{}	{}
17	Get notified by email	1	1	2	3	2022-06-03 14:20:22.800877	2022-06-03 14:20:22.800877	f	0	\N	3	{}	\N	\N	{}	{}
19	Hello, welcome to Yummi English!	1	1	3	3	2022-06-03 15:26:44.059041	2022-06-03 15:26:44.059041	f	0	\N	0	{}	\N	\N	{}	{}
20	Give the team a way to reach you.	1	1	3	3	2022-06-03 15:26:44.217135	2022-06-03 15:26:44.217135	f	0	\N	0	{}	\N	\N	{}	{}
21	Get notified by email	1	1	3	3	2022-06-03 15:26:44.229294	2022-06-03 15:26:44.229294	f	0	\N	3	{}	\N	\N	{}	{}
22	Conversation was resolved by Blue-meadow-608	1	1	3	2	2022-06-03 15:28:49.692457	2022-06-03 15:28:49.692457	f	0	\N	0	{}	\N	\N	{}	{}
23	Hello	1	1	4	0	2022-06-03 23:49:12.57416	2022-06-03 23:49:12.57416	f	0	\N	0	{}	Contact	12	{}	{}
24	Hello, welcome to Yummi English!	1	1	4	3	2022-06-03 23:49:12.723587	2022-06-03 23:49:12.723587	f	0	\N	0	{}	\N	\N	{}	{}
25	Give the team a way to reach you.	1	1	4	3	2022-06-03 23:49:12.843772	2022-06-03 23:49:12.843772	f	0	\N	0	{}	\N	\N	{}	{}
26	Get notified by email	1	1	4	3	2022-06-03 23:49:12.857682	2022-06-03 23:49:12.857682	f	0	\N	3	{}	\N	\N	{}	{}
28	Hello, welcome to Yummi English!	1	1	5	3	2022-06-04 07:27:17.196621	2022-06-04 07:27:17.196621	f	0	\N	0	{}	\N	\N	{}	{}
29	Give the team a way to reach you.	1	1	5	3	2022-06-04 07:27:17.364395	2022-06-04 07:27:17.364395	f	0	\N	0	{}	\N	\N	{}	{}
30	Get notified by email	1	1	5	3	2022-06-04 07:27:17.379967	2022-06-04 07:27:17.379967	f	0	\N	3	{}	\N	\N	{}	{}
32	Landon Ngo self-assigned this conversation	1	1	5	2	2022-06-06 00:11:19.863498	2022-06-06 00:11:19.863498	f	0	\N	0	{}	\N	\N	{}	{}
33	😁 	1	1	6	0	2022-06-06 00:16:00.811501	2022-06-06 00:16:00.811501	f	0	\N	0	{}	Contact	21	{}	{}
34	Hello, welcome to Yummi English!	1	1	6	3	2022-06-06 00:16:00.921279	2022-06-06 00:16:00.921279	f	0	\N	0	{}	\N	\N	{}	{}
35	Give the team a way to reach you.	1	1	6	3	2022-06-06 00:16:01.103795	2022-06-06 00:16:01.103795	f	0	\N	0	{}	\N	\N	{}	{}
36	Get notified by email	1	1	6	3	2022-06-06 00:16:01.118068	2022-06-06 00:16:01.118068	f	0	\N	3	{}	\N	\N	{}	{}
37	Assigned to customer service by Landon Ngo	1	1	5	2	2022-06-06 00:18:33.571798	2022-06-06 00:18:33.571798	f	0	\N	0	{}	\N	\N	{}	{}
38	Landon Ngo added request	1	1	5	2	2022-06-06 00:18:57.040478	2022-06-06 00:18:57.040478	f	0	\N	0	{}	\N	\N	{}	{}
39	This is message for Landon campaign	1	1	7	1	2022-06-06 00:57:00.59842	2022-06-06 00:57:00.59842	f	0	\N	0	\N	\N	\N	{}	{"campaign_id": 1}
40	Conversation was resolved by Proud-voice-436	1	1	7	2	2022-06-06 01:13:31.871637	2022-06-06 01:13:31.871637	f	0	\N	0	{}	\N	\N	{}	{}
41	Give the team a way to reach you.	1	1	7	3	2022-06-06 01:13:32.041189	2022-06-06 01:13:32.041189	f	0	\N	0	{}	\N	\N	{}	{}
42	Get notified by email	1	1	7	3	2022-06-06 01:13:32.068544	2022-06-06 02:05:29.889356	f	0	\N	3	"{\\"submitted_email\\":\\"tuanlinh@gmail.com\\"}"	\N	\N	{}	{}
45	Hello, welcome to Yummi English!	1	1	8	3	2022-06-06 02:05:47.829558	2022-06-06 02:05:47.829558	f	0	\N	0	{}	\N	\N	{}	{}
46	Give the team a way to reach you.	1	1	8	3	2022-06-06 02:05:47.920754	2022-06-06 02:05:47.920754	f	0	\N	0	{}	\N	\N	{}	{}
47	Get notified by email	1	1	8	3	2022-06-06 02:05:47.945486	2022-06-06 02:05:59.421126	f	0	\N	3	"{\\"submitted_email\\":\\"tuanlinh@gmail.com\\"}"	\N	\N	{}	{}
48	Conversation was resolved by Proud-voice-436	1	1	7	2	2022-06-06 02:07:09.634315	2022-06-06 02:07:09.634315	f	0	\N	0	{}	\N	\N	{}	{}
50	Hello, welcome to Yummi English!	1	1	9	3	2022-06-06 02:08:27.861235	2022-06-06 02:08:27.861235	f	0	\N	0	{}	\N	\N	{}	{}
51	Give the team a way to reach you.	1	1	9	3	2022-06-06 02:08:27.944767	2022-06-06 02:08:27.944767	f	0	\N	0	{}	\N	\N	{}	{}
52	Get notified by email	1	1	9	3	2022-06-06 02:08:27.961902	2022-06-06 02:08:34.205458	f	0	\N	3	"{\\"submitted_email\\":\\"tuanlinh@gmail.com\\"}"	\N	\N	{}	{}
54	Conversation was resolved by Proud-voice-436	1	1	9	2	2022-06-06 02:11:01.672437	2022-06-06 02:11:01.672437	f	0	\N	0	{}	\N	\N	{}	{}
56	Hello, welcome to Yummi English!	1	1	10	3	2022-06-06 02:13:35.446257	2022-06-06 02:13:35.446257	f	0	\N	0	{}	\N	\N	{}	{}
57	Give the team a way to reach you.	1	1	10	3	2022-06-06 02:13:35.517994	2022-06-06 02:13:35.517994	f	0	\N	0	{}	\N	\N	{}	{}
58	Get notified by email	1	1	10	3	2022-06-06 02:13:35.539799	2022-06-06 02:13:45.35687	f	0	\N	3	"{\\"submitted_email\\":\\"landon@gmail.com\\"}"	\N	\N	{}	{}
64	Hello, welcome to Yummi English!	1	1	12	3	2022-06-06 02:25:21.892525	2022-06-06 02:25:21.892525	f	0	\N	0	{}	\N	\N	{}	{}
65	Give the team a way to reach you.	1	1	12	3	2022-06-06 02:25:21.950427	2022-06-06 02:25:21.950427	f	0	\N	0	{}	\N	\N	{}	{}
66	Get notified by email	1	1	12	3	2022-06-06 02:25:21.960848	2022-06-06 02:25:38.694367	f	0	\N	3	"{\\"submitted_email\\":\\"contact@gmail.com\\"}"	\N	\N	{}	{}
60	Hello, welcome to Yummi English!	1	1	11	3	2022-06-06 02:20:27.841548	2022-06-06 02:20:27.841548	f	0	\N	0	{}	\N	\N	{}	{}
61	Give the team a way to reach you.	1	1	11	3	2022-06-06 02:20:27.918089	2022-06-06 02:20:27.918089	f	0	\N	0	{}	\N	\N	{}	{}
62	Get notified by email	1	1	11	3	2022-06-06 02:20:27.929622	2022-06-06 02:20:43.903816	f	0	\N	3	"{\\"submitted_email\\":\\"landon@gmail.com\\"}"	\N	\N	{}	{}
68	Hello, welcome to Yummi English!	1	1	13	3	2022-06-06 02:45:25.567249	2022-06-06 02:45:25.567249	f	0	\N	0	{}	\N	\N	{}	{}
70	Hello, welcome to Yummi English!	1	1	14	3	2022-06-06 02:47:38.644141	2022-06-06 02:47:38.644141	f	0	\N	0	{}	\N	\N	{}	{}
71	Landon Ngo added bug	1	1	14	2	2022-06-06 02:50:27.753369	2022-06-06 02:50:27.753369	f	0	\N	0	{}	\N	\N	{}	{}
74	Hello, welcome to Yummi English!	1	1	15	3	2022-06-06 02:52:04.418017	2022-06-06 02:52:04.418017	f	0	\N	0	{}	\N	\N	{}	{}
75	are you?	1	1	13	1	2022-06-06 02:54:28.095345	2022-06-06 02:54:28.095345	f	0	\N	0	\N	User	2	{}	{}
76	Landon Ngo self-assigned this conversation	1	1	15	2	2022-06-06 02:55:04.923112	2022-06-06 02:55:04.923112	f	0	\N	0	{}	\N	\N	{}	{}
77	are you?	1	1	15	1	2022-06-06 02:55:07.78564	2022-06-06 02:55:07.78564	f	0	\N	0	\N	User	2	{}	{}
78	Landon Ngo removed bug	1	1	14	2	2022-06-06 02:57:13.968432	2022-06-06 02:57:13.968432	f	0	\N	0	{}	\N	\N	{}	{}
79	Conversation was resolved by Proud-voice-436	1	1	7	2	2022-06-06 03:00:41.08186	2022-06-06 03:00:41.08186	f	0	\N	0	{}	\N	\N	{}	{}
81	Hello, welcome to Yummi English!	1	1	16	3	2022-06-06 03:10:42.174305	2022-06-06 03:10:42.174305	f	0	\N	0	{}	\N	\N	{}	{}
84	Conversation was resolved by Contact	1	1	16	2	2022-06-06 03:25:44.631078	2022-06-06 03:25:44.631078	f	0	\N	0	{}	\N	\N	{}	{}
85	Conversation was resolved by Proud-voice-436	1	1	8	2	2022-06-06 03:42:23.84068	2022-06-06 03:42:23.84068	f	0	\N	0	{}	\N	\N	{}	{}
87	Conversation was resolved by Proud-voice-436	1	1	7	2	2022-06-06 03:53:21.888175	2022-06-06 03:53:21.888175	f	0	\N	0	{}	\N	\N	{}	{}
89	Conversation was resolved by Proud-voice-436	1	1	7	2	2022-06-06 03:54:07.703047	2022-06-06 03:54:07.703047	f	0	\N	0	{}	\N	\N	{}	{}
91	Conversation was resolved by Proud-voice-436	1	1	7	2	2022-06-06 03:57:11.13085	2022-06-06 03:57:11.13085	f	0	\N	0	{}	\N	\N	{}	{}
93	Conversation was resolved by Proud-voice-436	1	1	7	2	2022-06-06 04:00:13.706161	2022-06-06 04:00:13.706161	f	0	\N	0	{}	\N	\N	{}	{}
96	Conversation was reopened by Landon Ngo	1	1	7	2	2022-06-06 04:01:04.627952	2022-06-06 04:01:04.627952	f	0	\N	0	{}	\N	\N	{}	{}
97	Conversation was resolved by Proud-voice-436	1	1	7	2	2022-06-06 04:05:18.57486	2022-06-06 04:05:18.57486	f	0	\N	0	{}	\N	\N	{}	{}
98	chat	1	1	7	1	2022-06-06 04:05:29.269012	2022-06-06 04:05:29.269012	f	0	\N	0	\N	User	2	{}	{}
100	Conversation was reopened by Landon Ngo	1	1	7	2	2022-06-06 04:05:48.327707	2022-06-06 04:05:48.327707	f	0	\N	0	{}	\N	\N	{}	{}
101	Conversation was resolved by Proud-voice-436	1	1	7	2	2022-06-06 04:06:19.800922	2022-06-06 04:06:19.800922	f	0	\N	0	{}	\N	\N	{}	{}
103	Conversation was reopened by Landon Ngo	1	1	7	2	2022-06-06 04:06:28.225047	2022-06-06 04:06:28.225047	f	0	\N	0	{}	\N	\N	{}	{}
105	Hello, welcome to Yummi English!	1	1	17	3	2022-06-06 04:08:05.597911	2022-06-06 04:08:05.597911	f	0	\N	0	{}	\N	\N	{}	{}
106	Conversation was resolved by Landon	1	1	17	2	2022-06-06 04:08:49.914574	2022-06-06 04:08:49.914574	f	0	\N	0	{}	\N	\N	{}	{}
108	Conversation was resolved by Landon	1	1	17	2	2022-06-06 04:12:42.154664	2022-06-06 04:12:42.154664	f	0	\N	0	{}	\N	\N	{}	{}
110	Hello, welcome to Yummi English!	1	1	18	3	2022-06-06 04:14:20.480325	2022-06-06 04:14:20.480325	f	0	\N	0	{}	\N	\N	{}	{}
111	Conversation was resolved by Landon	1	1	18	2	2022-06-06 04:15:10.33292	2022-06-06 04:15:10.33292	f	0	\N	0	{}	\N	\N	{}	{}
113	New campaign message	1	1	19	1	2022-06-06 04:30:35.532541	2022-06-06 04:30:35.532541	f	0	\N	0	\N	\N	\N	{}	{"campaign_id": 2}
114	alo	1	1	19	0	2022-06-06 04:30:37.958657	2022-06-06 04:30:37.958657	f	0	\N	0	{}	Contact	4	{}	{}
115	Conversation was resolved by Polished-sunset-626	1	1	19	2	2022-06-06 05:36:27.37735	2022-06-06 05:36:27.37735	f	0	\N	0	{}	\N	\N	{}	{}
117	Hello, welcome to Yummi English!	1	1	20	3	2022-06-06 05:47:04.542959	2022-06-06 05:47:04.542959	f	0	\N	0	{}	\N	\N	{}	{}
118	Give the team a way to reach you.	1	1	20	3	2022-06-06 05:47:04.610092	2022-06-06 05:47:04.610092	f	0	\N	0	{}	\N	\N	{}	{}
120	Conversation was resolved by Old-dust-580	1	1	20	2	2022-06-06 05:47:24.840272	2022-06-06 05:47:24.840272	f	0	\N	0	{}	\N	\N	{}	{}
122	Conversation was resolved by Old-dust-580	1	1	20	2	2022-06-06 05:47:46.890314	2022-06-06 05:47:46.890314	f	0	\N	0	{}	\N	\N	{}	{}
124	Conversation was resolved by Old-dust-580	1	1	20	2	2022-06-06 05:52:54.56725	2022-06-06 05:52:54.56725	f	0	\N	0	{}	\N	\N	{}	{}
127	Hello, welcome to Yummi English!	1	1	21	3	2022-06-06 05:58:27.718004	2022-06-06 05:58:27.718004	f	0	\N	0	{}	\N	\N	{}	{}
128	Give the team a way to reach you.	1	1	21	3	2022-06-06 05:58:27.762468	2022-06-06 05:58:27.762468	f	0	\N	0	{}	\N	\N	{}	{}
129	Get notified by email	1	1	21	3	2022-06-06 05:58:27.773225	2022-06-06 05:58:27.773225	f	0	\N	3	{}	\N	\N	{}	{}
131	Hello, welcome to Yummi English!	1	1	22	3	2022-06-06 06:00:49.647168	2022-06-06 06:00:49.647168	f	0	\N	0	{}	\N	\N	{}	{}
132	Give the team a way to reach you.	1	1	22	3	2022-06-06 06:00:49.740324	2022-06-06 06:00:49.740324	f	0	\N	0	{}	\N	\N	{}	{}
133	Get notified by email	1	1	22	3	2022-06-06 06:00:49.782562	2022-06-06 06:00:56.003417	f	0	\N	3	"{\\"submitted_email\\":\\"landon@gmail.com\\"}"	\N	\N	{}	{}
136	Conversation was resolved by Landon	1	1	22	2	2022-06-06 06:14:18.553796	2022-06-06 06:14:18.553796	f	0	\N	0	{}	\N	\N	{}	{}
119	Get notified by email	1	1	20	3	2022-06-06 05:47:04.623927	2022-06-06 06:27:38.358893	f	0	\N	3	"{\\"submitted_email\\":\\"contact@gmail.com\\"}"	\N	\N	{}	{}
116	check	1	1	20	0	2022-06-06 05:47:04.452185	2022-06-06 06:27:38.466111	f	0	\N	0	{}	Contact	56	{}	{}
121	mỏe	1	1	20	0	2022-06-06 05:47:31.034635	2022-06-06 06:27:38.480628	f	0	\N	0	{}	Contact	56	{}	{}
123	LO	1	1	20	0	2022-06-06 05:52:41.298593	2022-06-06 06:27:38.496393	f	0	\N	0	{}	Contact	56	{}	{}
125	cHECK	1	1	20	0	2022-06-06 05:52:57.977184	2022-06-06 06:27:38.521041	f	0	\N	0	{}	Contact	56	{}	{}
138	*bug	1	1	20	0	2022-06-06 06:27:52.565521	2022-06-06 06:27:52.565521	f	0	\N	0	{}	Contact	56	{}	{}
139	conect	1	1	20	0	2022-06-06 06:34:27.573215	2022-06-06 06:34:27.573215	f	0	\N	0	{}	Contact	56	{}	{}
140	Conversation was resolved by Contact	1	1	20	2	2022-06-06 06:40:47.724048	2022-06-06 06:40:47.724048	f	0	\N	0	{}	\N	\N	{}	{}
141	alo	1	1	20	0	2022-06-06 06:40:50.746708	2022-06-06 06:40:50.746708	f	0	\N	0	{}	Contact	56	{}	{}
142	feedback	1	1	20	0	2022-06-06 06:57:30.510219	2022-06-06 06:57:30.510219	f	0	\N	0	{}	Contact	56	{}	{}
143	FEEDBACK	1	1	20	0	2022-06-06 06:57:48.399764	2022-06-06 06:57:48.399764	f	0	\N	0	{}	Contact	56	{}	{}
145	Hello, welcome to Yummi English!	1	1	23	3	2022-06-06 06:59:09.002573	2022-06-06 06:59:09.002573	f	0	\N	0	{}	\N	\N	{}	{}
146	Give the team a way to reach you.	1	1	23	3	2022-06-06 06:59:09.11984	2022-06-06 06:59:09.11984	f	0	\N	0	{}	\N	\N	{}	{}
147	Get notified by email	1	1	23	3	2022-06-06 06:59:09.134519	2022-06-06 06:59:20.228149	f	0	\N	3	"{\\"submitted_email\\":\\"landon@gmail.com\\"}"	\N	\N	{}	{}
148	REQUEST	1	1	23	1	2022-06-06 07:01:27.802937	2022-06-06 07:01:27.802937	f	0	\N	0	\N	User	2	{}	{}
150	Conversation was resolved by Landon	1	1	23	2	2022-06-06 07:08:05.683238	2022-06-06 07:08:05.683238	f	0	\N	0	{}	\N	\N	{}	{}
152	Conversation was resolved by Landon	1	1	23	2	2022-06-06 07:40:45.183125	2022-06-06 07:40:45.183125	f	0	\N	0	{}	\N	\N	{}	{}
153	New campaign message	1	1	24	1	2022-06-06 08:21:37.898866	2022-06-06 08:21:37.898866	f	0	\N	0	\N	\N	\N	{}	{"campaign_id": 2}
154	Conversation was resolved by Proud-star-361	1	1	24	2	2022-06-06 08:21:41.92674	2022-06-06 08:21:41.92674	f	0	\N	0	{}	\N	\N	{}	{}
156	Hello, welcome to Yummy English!	1	1	25	3	2022-06-06 09:19:49.955008	2022-06-06 09:19:49.955008	f	0	\N	0	{}	\N	\N	{}	{}
157	Conversation was resolved by Landon	1	1	25	2	2022-06-06 09:20:32.238331	2022-06-06 09:20:32.238331	f	0	\N	0	{}	\N	\N	{}	{}
158	Please rate the conversation	1	1	25	3	2022-06-06 09:20:32.468916	2022-06-06 09:20:32.468916	f	0	\N	9	{}	\N	\N	{}	{}
160	Hello, welcome to Yummy English!	1	1	26	3	2022-06-06 09:23:35.038309	2022-06-06 09:23:35.038309	f	0	\N	0	{}	\N	\N	{}	{}
161	Conversation was resolved by Landon	1	1	26	2	2022-06-06 09:23:41.375434	2022-06-06 09:23:41.375434	f	0	\N	0	{}	\N	\N	{}	{}
163	Hello, welcome to Yummy English!	1	1	27	3	2022-06-06 09:25:08.463274	2022-06-06 09:25:08.463274	f	0	\N	0	{}	\N	\N	{}	{}
164	Conversation was resolved by Landon	1	1	27	2	2022-06-06 09:25:26.925845	2022-06-06 09:25:26.925845	f	0	\N	0	{}	\N	\N	{}	{}
166	Hello, welcome to Yummy English!	1	1	28	3	2022-06-06 09:25:33.154884	2022-06-06 09:25:33.154884	f	0	\N	0	{}	\N	\N	{}	{}
167	Conversation was resolved by Landon	1	1	28	2	2022-06-06 09:25:50.081513	2022-06-06 09:25:50.081513	f	0	\N	0	{}	\N	\N	{}	{}
169	Hello, welcome to Yummy English!	1	1	29	3	2022-06-06 09:26:07.700652	2022-06-06 09:26:07.700652	f	0	\N	0	{}	\N	\N	{}	{}
170	Test	1	1	30	0	2022-06-06 09:27:28.905615	2022-06-06 09:27:28.905615	f	0	\N	0	{}	Contact	80	{}	{}
171	Hello, welcome to Yummy English!	1	1	30	3	2022-06-06 09:27:29.304369	2022-06-06 09:27:29.304369	f	0	\N	0	{}	\N	\N	{}	{}
172	123123	1	1	31	0	2022-06-06 23:57:09.984231	2022-06-06 23:57:09.984231	f	0	\N	0	{}	Contact	80	{}	{}
173	Hello, welcome to Yummy English!	1	1	31	3	2022-06-06 23:57:10.278228	2022-06-06 23:57:10.278228	f	0	\N	0	{}	\N	\N	{}	{}
174	Conversation was resolved by Landon	1	1	31	2	2022-06-07 00:04:12.789446	2022-06-07 00:04:12.789446	f	0	\N	0	{}	\N	\N	{}	{}
175	new comment\n	1	1	32	0	2022-06-07 00:04:48.910233	2022-06-07 00:04:48.910233	f	0	\N	0	{}	Contact	80	{}	{}
176	Hello, welcome to Yummy English!	1	1	32	3	2022-06-07 00:04:49.172098	2022-06-07 00:04:49.172098	f	0	\N	0	{}	\N	\N	{}	{}
177	Conversation was resolved by Landon	1	1	32	2	2022-06-07 00:10:26.425694	2022-06-07 00:10:26.425694	f	0	\N	0	{}	\N	\N	{}	{}
178	new message	1	1	33	0	2022-06-07 00:10:39.97436	2022-06-07 00:10:39.97436	f	0	\N	0	{}	Contact	80	{}	{}
179	Hello, welcome to Yummy English!	1	1	33	3	2022-06-07 00:10:40.133765	2022-06-07 00:10:40.133765	f	0	\N	0	{}	\N	\N	{}	{}
180	Conversation was resolved by Landon	1	1	33	2	2022-06-07 00:11:55.204558	2022-06-07 00:11:55.204558	f	0	\N	0	{}	\N	\N	{}	{}
181	new test	1	1	34	0	2022-06-07 00:12:11.251212	2022-06-07 00:12:11.251212	f	0	\N	0	{}	Contact	80	{}	{}
182	Hello, welcome to Yummy English!	1	1	34	3	2022-06-07 00:12:11.381401	2022-06-07 00:12:11.381401	f	0	\N	0	{}	\N	\N	{}	{}
183	Conversation was resolved by Landon	1	1	34	2	2022-06-07 00:12:34.563334	2022-06-07 00:12:34.563334	f	0	\N	0	{}	\N	\N	{}	{}
184	check	1	1	34	0	2022-06-07 00:17:56.377666	2022-06-07 00:17:56.377666	f	0	\N	0	{}	Contact	80	{}	{}
185	more	1	1	34	0	2022-06-07 00:20:44.3142	2022-06-07 00:20:44.3142	f	0	\N	0	{}	Contact	80	{}	{}
186	\N	1	1	34	0	2022-06-07 00:21:31.663657	2022-06-07 00:21:31.663657	f	0	\N	0	{}	Contact	80	{}	{}
187	BUG	1	1	34	1	2022-06-07 00:24:12.194387	2022-06-07 00:24:12.194387	f	0	\N	0	\N	User	1	{}	{}
188	DONE	1	1	34	1	2022-06-07 00:27:34.497425	2022-06-07 00:27:34.497425	f	0	\N	0	\N	User	1	{}	{}
189	REQUEST	1	1	35	0	2022-06-07 00:28:35.471908	2022-06-07 00:28:35.471908	f	0	\N	0	{}	Contact	80	{}	{}
190	Hello, welcome to Yummy English!	1	1	35	3	2022-06-07 00:28:35.744928	2022-06-07 00:28:35.744928	f	0	\N	0	{}	\N	\N	{}	{}
191	FEEDBACK	1	1	35	0	2022-06-07 00:28:59.492541	2022-06-07 00:28:59.492541	f	0	\N	0	{}	Contact	80	{}	{}
192	Test message\n	1	1	36	0	2022-06-07 01:43:08.972743	2022-06-07 01:43:08.972743	f	0	\N	0	{}	Contact	80	{}	{}
193	Hello, welcome to Yummy English!	1	1	36	3	2022-06-07 01:43:09.26977	2022-06-07 01:43:09.26977	f	0	\N	0	{}	\N	\N	{}	{}
194	asdasd	1	1	36	0	2022-06-07 01:43:20.728943	2022-06-07 01:43:20.728943	f	0	\N	0	{}	Contact	80	{}	{}
195	new message	1	1	37	0	2022-06-07 03:49:15.450272	2022-06-07 03:49:15.450272	f	0	\N	0	{}	Contact	56	{}	{}
196	Hello, welcome to Yummy English!	1	1	37	3	2022-06-07 03:49:15.717415	2022-06-07 03:49:15.717415	f	0	\N	0	{}	\N	\N	{}	{}
197	# bug test	1	1	19	0	2022-06-07 07:37:53.213199	2022-06-07 07:37:53.213199	f	0	\N	0	{}	Contact	4	{}	{}
198	#bug test	1	1	19	0	2022-06-07 07:38:34.496548	2022-06-07 07:38:34.496548	f	0	\N	0	{}	Contact	4	{}	{}
199	k	1	1	38	0	2022-06-07 07:50:32.388481	2022-06-07 07:50:32.388481	f	0	\N	0	{}	Contact	106	{}	{}
200	Hello, welcome to Yummy English!	1	1	38	3	2022-06-07 07:50:32.695246	2022-06-07 07:50:32.695246	f	0	\N	0	{}	\N	\N	{}	{}
201	Give the team a way to reach you.	1	1	38	3	2022-06-07 07:50:32.84995	2022-06-07 07:50:32.84995	f	0	\N	0	{}	\N	\N	{}	{}
202	Get notified by email	1	1	38	3	2022-06-07 07:50:32.877461	2022-06-07 07:50:32.877461	f	0	\N	3	{}	\N	\N	{}	{}
203	alo	1	1	39	0	2022-06-07 08:23:59.912012	2022-06-07 08:23:59.912012	f	0	\N	0	{}	Contact	108	{}	{}
204	Hello, welcome to Yummy English!	1	1	39	3	2022-06-07 08:24:00.081085	2022-06-07 08:24:00.081085	f	0	\N	0	{}	\N	\N	{}	{}
205	Give the team a way to reach you.	1	1	39	3	2022-06-07 08:24:00.294744	2022-06-07 08:24:00.294744	f	0	\N	0	{}	\N	\N	{}	{}
206	Get notified by email	1	1	39	3	2022-06-07 08:24:00.313541	2022-06-07 08:24:00.313541	f	0	\N	3	{}	\N	\N	{}	{}
208	Hello, welcome to Yummy English!	1	1	40	3	2022-06-07 08:24:20.016915	2022-06-07 08:24:20.016915	f	0	\N	0	{}	\N	\N	{}	{}
209	Give the team a way to reach you.	1	1	40	3	2022-06-07 08:24:20.157791	2022-06-07 08:24:20.157791	f	0	\N	0	{}	\N	\N	{}	{}
210	Get notified by email	1	1	40	3	2022-06-07 08:24:20.198915	2022-06-07 08:24:26.09346	f	0	\N	3	"{\\"submitted_email\\":\\"landon@gmail.com\\"}"	\N	\N	{}	{}
207	Check	1	1	40	0	2022-06-07 08:24:19.831292	2022-06-07 08:24:26.224056	f	0	\N	0	{}	Contact	80	{}	{}
212	chay di ban ei	1	1	40	0	2022-06-07 08:24:58.932799	2022-06-07 08:24:58.932799	f	0	\N	0	{}	Contact	80	{}	{}
213	#bug	1	1	40	0	2022-06-07 08:31:18.859861	2022-06-07 08:31:18.859861	f	0	\N	0	{}	Contact	80	{}	{}
211	alo alo	1	1	40	0	2022-06-07 08:24:53.192635	2022-06-07 08:24:53.192635	f	0	\N	0	{}	Contact	80	{}	{}
214	send	1	1	20	0	2022-06-08 00:16:20.483165	2022-06-08 00:16:20.483165	f	0	\N	0	{}	Contact	56	{}	{}
215	Landon test	1	1	20	0	2022-06-08 00:18:25.927297	2022-06-08 00:18:25.927297	f	0	\N	0	{}	Contact	56	{}	{}
216	#bug	1	1	20	0	2022-06-08 00:19:43.468439	2022-06-08 00:19:43.468439	f	0	\N	0	{}	Contact	56	{}	{}
217	test	1	1	20	0	2022-06-08 00:21:20.361101	2022-06-08 00:21:20.361101	f	0	\N	0	{}	Contact	56	{}	{}
218	#bug	1	1	20	0	2022-06-08 00:21:25.270706	2022-06-08 00:21:25.270706	f	0	\N	0	{}	Contact	56	{}	{}
219	run	1	1	20	0	2022-06-08 00:21:56.672188	2022-06-08 00:21:56.672188	f	0	\N	0	{}	Contact	56	{}	{}
220	#bug run	1	1	20	0	2022-06-08 00:22:02.576775	2022-06-08 00:22:02.576775	f	0	\N	0	{}	Contact	56	{}	{}
221	#bug again	1	1	20	0	2022-06-08 00:22:18.838856	2022-06-08 00:22:18.838856	f	0	\N	0	{}	Contact	56	{}	{}
222	send	1	1	20	0	2022-06-08 00:25:01.633264	2022-06-08 00:25:01.633264	f	0	\N	0	{}	Contact	56	{}	{}
223	chec	1	1	20	0	2022-06-08 01:17:10.176779	2022-06-08 01:17:10.176779	f	0	\N	0	{}	Contact	56	{}	{}
224	check message	1	1	20	0	2022-06-08 01:41:36.77924	2022-06-08 01:41:36.77924	f	0	\N	0	{}	Contact	56	{}	{}
225	#bug	1	1	20	0	2022-06-08 01:42:52.790824	2022-06-08 01:42:52.790824	f	0	\N	0	{}	Contact	56	{}	{}
\.


--
-- TOC entry 4120 (class 0 OID 20125)
-- Dependencies: 300
-- Data for Name: notes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notes (id, content, account_id, contact_id, user_id, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 4122 (class 0 OID 20137)
-- Dependencies: 302
-- Data for Name: notification_settings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notification_settings (id, account_id, user_id, email_flags, created_at, updated_at, push_flags) FROM stdin;
1	1	1	2	2022-06-03 07:01:05.454724	2022-06-03 07:01:05.454724	2
2	1	2	2	2022-06-03 08:33:22.95059	2022-06-03 08:33:22.95059	2
\.


--
-- TOC entry 4124 (class 0 OID 20147)
-- Dependencies: 304
-- Data for Name: notification_subscriptions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notification_subscriptions (id, user_id, subscription_type, subscription_attributes, created_at, updated_at, identifier) FROM stdin;
\.


--
-- TOC entry 4126 (class 0 OID 20159)
-- Dependencies: 306
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notifications (id, account_id, user_id, notification_type, primary_actor_type, primary_actor_id, secondary_actor_type, secondary_actor_id, read_at, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 4128 (class 0 OID 20172)
-- Dependencies: 308
-- Data for Name: platform_app_permissibles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.platform_app_permissibles (id, platform_app_id, permissible_type, permissible_id, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 4130 (class 0 OID 20184)
-- Dependencies: 310
-- Data for Name: platform_apps; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.platform_apps (id, name, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 4132 (class 0 OID 20193)
-- Dependencies: 312
-- Data for Name: reporting_events; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reporting_events (id, name, value, account_id, inbox_id, user_id, conversation_id, created_at, updated_at, value_in_business_hours, event_start_time, event_end_time) FROM stdin;
1	first_response	26	1	1	1	1	2022-06-03 09:36:27.807366	2022-06-03 09:36:27.807366	0	2022-06-03 09:36:01.553171	2022-06-03 09:36:27.495272
2	conversation_resolved	126	1	1	1	3	2022-06-03 15:28:49.501867	2022-06-03 15:28:49.501867	0	2022-06-03 15:26:43.385423	2022-06-03 15:28:49.229901
3	conversation_resolved	991	1	1	1	7	2022-06-06 01:13:31.826089	2022-06-06 01:13:31.826089	0	2022-06-06 00:57:00.276797	2022-06-06 01:13:31.651714
4	conversation_resolved	4209	1	1	1	7	2022-06-06 02:07:09.720082	2022-06-06 02:07:09.720082	0	2022-06-06 00:57:00.276797	2022-06-06 02:07:09.521177
5	conversation_resolved	154	1	1	1	9	2022-06-06 02:11:01.618313	2022-06-06 02:11:01.618313	0	2022-06-06 02:08:27.674319	2022-06-06 02:11:01.560414
6	first_response	543	1	1	1	13	2022-06-06 02:54:28.244398	2022-06-06 02:54:28.244398	0	2022-06-06 02:45:25.31161	2022-06-06 02:54:28.095345
7	first_response	184	1	1	2	15	2022-06-06 02:55:07.927047	2022-06-06 02:55:07.927047	0	2022-06-06 02:52:03.905155	2022-06-06 02:55:07.78564
8	conversation_resolved	7420	1	1	1	7	2022-06-06 03:00:41.01124	2022-06-06 03:00:41.01124	0	2022-06-06 00:57:00.276797	2022-06-06 03:00:40.967243
9	conversation_resolved	903	1	1	1	16	2022-06-06 03:25:44.565603	2022-06-06 03:25:44.565603	0	2022-06-06 03:10:41.896215	2022-06-06 03:25:44.504966
10	conversation_resolved	5796	1	1	1	8	2022-06-06 03:42:23.699225	2022-06-06 03:42:23.699225	0	2022-06-06 02:05:47.576847	2022-06-06 03:42:23.670178
11	conversation_resolved	10581	1	1	1	7	2022-06-06 03:53:21.829489	2022-06-06 03:53:21.829489	0	2022-06-06 00:57:00.276797	2022-06-06 03:53:21.803544
12	conversation_resolved	10627	1	1	1	7	2022-06-06 03:54:07.63285	2022-06-06 03:54:07.63285	0	2022-06-06 00:57:00.276797	2022-06-06 03:54:07.599065
13	conversation_resolved	10811	1	1	1	7	2022-06-06 03:57:11.071151	2022-06-06 03:57:11.071151	0	2022-06-06 00:57:00.276797	2022-06-06 03:57:11.002299
14	conversation_resolved	10993	1	1	1	7	2022-06-06 04:00:13.658489	2022-06-06 04:00:13.658489	0	2022-06-06 00:57:00.276797	2022-06-06 04:00:13.608783
15	conversation_resolved	11298	1	1	1	7	2022-06-06 04:05:18.493734	2022-06-06 04:05:18.493734	0	2022-06-06 00:57:00.276797	2022-06-06 04:05:18.455099
16	first_response	11309	1	1	1	7	2022-06-06 04:05:29.393432	2022-06-06 04:05:29.393432	0	2022-06-06 00:57:00.276797	2022-06-06 04:05:29.269012
17	conversation_resolved	11359	1	1	1	7	2022-06-06 04:06:19.717471	2022-06-06 04:06:19.717471	0	2022-06-06 00:57:00.276797	2022-06-06 04:06:19.653947
18	conversation_resolved	44	1	1	1	17	2022-06-06 04:08:49.849128	2022-06-06 04:08:49.849128	0	2022-06-06 04:08:05.317252	2022-06-06 04:08:49.821031
19	conversation_resolved	277	1	1	1	17	2022-06-06 04:12:42.098724	2022-06-06 04:12:42.098724	0	2022-06-06 04:08:05.317252	2022-06-06 04:12:42.072741
20	conversation_resolved	50	1	1	1	18	2022-06-06 04:15:10.265282	2022-06-06 04:15:10.265282	0	2022-06-06 04:14:20.284543	2022-06-06 04:15:10.225882
21	conversation_resolved	3951	1	1	1	19	2022-06-06 05:36:27.072494	2022-06-06 05:36:27.072494	0	2022-06-06 04:30:35.347446	2022-06-06 05:36:26.973652
22	conversation_resolved	20	1	1	1	20	2022-06-06 05:47:24.748009	2022-06-06 05:47:24.748009	0	2022-06-06 05:47:04.328775	2022-06-06 05:47:24.713829
23	conversation_resolved	42	1	1	1	20	2022-06-06 05:47:46.842279	2022-06-06 05:47:46.842279	0	2022-06-06 05:47:04.328775	2022-06-06 05:47:46.810828
24	conversation_resolved	350	1	1	1	20	2022-06-06 05:52:54.48786	2022-06-06 05:52:54.48786	0	2022-06-06 05:47:04.328775	2022-06-06 05:52:54.455135
25	conversation_resolved	809	1	1	1	22	2022-06-06 06:14:18.5041	2022-06-06 06:14:18.5041	0	2022-06-06 06:00:49.434099	2022-06-06 06:14:18.457463
26	conversation_resolved	3223	1	1	1	20	2022-06-06 06:40:47.663432	2022-06-06 06:40:47.663432	0	2022-06-06 05:47:04.328775	2022-06-06 06:40:47.627461
27	first_response	139	1	1	1	23	2022-06-06 07:01:28.025293	2022-06-06 07:01:28.025293	0	2022-06-06 06:59:08.811955	2022-06-06 07:01:27.802937
28	conversation_resolved	537	1	1	1	23	2022-06-06 07:08:05.644112	2022-06-06 07:08:05.644112	0	2022-06-06 06:59:08.811955	2022-06-06 07:08:05.61756
29	conversation_resolved	2497	1	1	1	23	2022-06-06 07:40:45.09347	2022-06-06 07:40:45.09347	0	2022-06-06 06:59:08.811955	2022-06-06 07:40:45.049408
30	conversation_resolved	4	1	1	1	24	2022-06-06 08:21:41.825078	2022-06-06 08:21:41.825078	0	2022-06-06 08:21:37.512648	2022-06-06 08:21:41.777799
31	conversation_resolved	43	1	1	1	25	2022-06-06 09:20:32.230828	2022-06-06 09:20:32.230828	0	2022-06-06 09:19:49.242615	2022-06-06 09:20:32.095609
32	conversation_resolved	7	1	1	1	26	2022-06-06 09:23:41.270928	2022-06-06 09:23:41.270928	0	2022-06-06 09:23:34.720378	2022-06-06 09:23:41.174843
33	conversation_resolved	19	1	1	1	27	2022-06-06 09:25:26.792585	2022-06-06 09:25:26.792585	0	2022-06-06 09:25:07.925395	2022-06-06 09:25:26.747284
34	conversation_resolved	17	1	1	1	28	2022-06-06 09:25:50.001886	2022-06-06 09:25:50.001886	0	2022-06-06 09:25:32.846207	2022-06-06 09:25:49.962983
35	conversation_resolved	423	1	1	1	31	2022-06-07 00:04:12.69334	2022-06-07 00:04:12.69334	0	2022-06-06 23:57:09.842913	2022-06-07 00:04:12.610925
36	conversation_resolved	338	1	1	1	32	2022-06-07 00:10:26.280019	2022-06-07 00:10:26.280019	0	2022-06-07 00:04:48.855104	2022-06-07 00:10:26.194496
37	conversation_resolved	75	1	1	1	33	2022-06-07 00:11:55.033756	2022-06-07 00:11:55.033756	0	2022-06-07 00:10:39.912117	2022-06-07 00:11:54.979344
38	conversation_resolved	23	1	1	1	34	2022-06-07 00:12:34.489474	2022-06-07 00:12:34.489474	0	2022-06-07 00:12:11.20716	2022-06-07 00:12:34.46039
39	first_response	721	1	1	1	34	2022-06-07 00:24:12.375995	2022-06-07 00:24:12.375995	0	2022-06-07 00:12:11.20716	2022-06-07 00:24:12.194387
\.


--
-- TOC entry 4149 (class 0 OID 20448)
-- Dependencies: 329
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.schema_migrations (version) FROM stdin;
20220506163839
20200225162150
20200309170810
20200309213132
20200310062527
20200310070540
20200311083854
20200325210612
20200330071706
20200330115622
20200331095710
20200404092329
20200404135009
20200410145519
20200411125638
20200417093432
20200418124534
20200422130153
20200429082655
20200430163438
20200503151130
20200504144712
20200509044639
20200510112339
20200510154151
20200520125815
20200522115645
20200605130625
20200606132552
20200607140737
20200610143132
20200625124400
20200625154254
20200627115105
20200629122646
20200704135408
20200704135810
20200704140029
20200704140509
20200704173104
20200709145000
20200715124113
20200719171437
20200725131651
20200730080242
20200802170002
20200819190629
20200828175931
20200907094912
20200907171106
20200927135222
20201003105618
20201011152227
20201019173944
20201027135006
20201123195011
20201124101124
20201125121240
20201125123131
20210105185632
20210109211805
20210112174124
20210113045116
20210114202310
20210126121313
20210201150037
20210212154240
20210217154129
20210219085719
20210222131048
20210222131155
20210303192243
20210306170117
20210315101919
20210425093724
20210426191914
20210428135041
20210428151147
20210430095748
20210430100138
20210513083044
20210513143021
20210520200729
20210527173755
20210602182058
20210609133433
20210611180221
20210611180222
20210618073042
20210618095823
20210623150613
20210623155413
20210707142801
20210708140842
20210714110714
20210721182458
20210722095814
20210723094412
20210723095657
20210824152852
20210827120929
20210828124043
20210829124254
20210902181438
20210916060144
20210916112533
20210922082754
20210923132659
20210923190418
20210927062350
20211012135050
20211027073553
20211109143122
20211110101046
20211116131740
20211118100301
20211122061012
20211122112607
20211129120040
20211201224513
20211207113102
20211208081344
20211208085931
20211216110209
20211219031453
20211221125545
20220110090126
20220111200105
20220111223630
20220116103902
20220119051739
20220121055444
20220129024443
20220131081750
20220207124741
20220215060751
20220216151613
20220218120357
20220315204137
20220316054933
20220329131401
20220405092033
20220409044943
20220416203340
20220416205519
20220418094715
20220424081117
20220428101325
\.


--
-- TOC entry 4134 (class 0 OID 20208)
-- Dependencies: 314
-- Data for Name: taggings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.taggings (id, tag_id, taggable_type, taggable_id, tagger_type, tagger_id, context, created_at) FROM stdin;
1	1	Conversation	5	\N	\N	labels	2022-06-06 00:18:56.967767
5	2	Conversation	16	\N	\N	labels	2022-06-06 03:11:10.033763
6	2	Conversation	22	\N	\N	labels	2022-06-06 06:01:50.420535
9	2	Conversation	20	\N	\N	labels	2022-06-06 06:27:52.895643
10	3	Conversation	20	\N	\N	labels	2022-06-06 06:57:48.618347
11	1	Conversation	23	\N	\N	labels	2022-06-06 07:01:28.214161
12	2	Conversation	34	\N	\N	labels	2022-06-07 00:24:12.618923
13	1	Conversation	35	\N	\N	labels	2022-06-07 00:28:36.05726
14	3	Conversation	35	\N	\N	labels	2022-06-07 00:28:59.828447
15	2	Conversation	19	\N	\N	labels	2022-06-07 07:38:35.335361
16	2	Conversation	40	\N	\N	labels	2022-06-07 08:31:43.665116
\.


--
-- TOC entry 4136 (class 0 OID 20226)
-- Dependencies: 316
-- Data for Name: tags; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tags (id, name, taggings_count) FROM stdin;
1	request	3
3	feedback	2
2	bug	6
\.


--
-- TOC entry 4138 (class 0 OID 20237)
-- Dependencies: 318
-- Data for Name: team_members; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.team_members (id, team_id, user_id, created_at, updated_at) FROM stdin;
1	1	2	2022-06-03 08:33:47.278086	2022-06-03 08:33:47.278086
2	2	2	2022-06-06 02:57:59.215522	2022-06-06 02:57:59.215522
3	2	1	2022-06-06 02:57:59.233913	2022-06-06 02:57:59.233913
4	3	2	2022-06-07 07:16:41.974899	2022-06-07 07:16:41.974899
5	3	1	2022-06-07 07:16:41.990973	2022-06-07 07:16:41.990973
\.


--
-- TOC entry 4140 (class 0 OID 20247)
-- Dependencies: 320
-- Data for Name: teams; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.teams (id, name, description, allow_auto_assign, account_id, created_at, updated_at) FROM stdin;
1	customer service		t	1	2022-06-03 08:33:43.72038	2022-06-03 08:33:43.72038
2	tester		t	1	2022-06-06 02:57:53.96455	2022-06-07 07:16:18.378941
3	developer		t	1	2022-06-07 07:16:34.128007	2022-06-07 07:16:34.128007
\.


--
-- TOC entry 4142 (class 0 OID 20259)
-- Dependencies: 322
-- Data for Name: telegram_bots; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.telegram_bots (id, name, auth_key, account_id, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 4144 (class 0 OID 20268)
-- Dependencies: 324
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, provider, uid, encrypted_password, reset_password_token, reset_password_sent_at, remember_created_at, sign_in_count, current_sign_in_at, last_sign_in_at, current_sign_in_ip, last_sign_in_ip, confirmation_token, confirmed_at, confirmation_sent_at, unconfirmed_email, name, display_name, email, tokens, created_at, updated_at, pubsub_token, availability, ui_settings, custom_attributes, type, message_signature) FROM stdin;
1	email	phpswteam@gmail.com	$2a$11$1JXKgr6U9wYHrF9bmWxxo.FMLaLigxSJKiQieWjJUL/7PqEbl.EwC	\N	\N	\N	7	2022-06-06 08:27:46.158897	2022-06-06 00:03:22.320718	10.233.97.0	10.233.97.0	\N	2022-06-03 07:01:05.137708	\N	\N	PHP Software Team	\N	phpswteam@gmail.com	"{\\"2NEgayQ5tANhY8Sla9vf5w\\":{\\"token\\":\\"$2a$10$jTkW78VqXTVjNEaO7dJGWO0thn7aWtFHXcZB8S4X9Hiu..Nknwgg6\\",\\"expiry\\":1659510074},\\"jmIRuDCTK-Dcw2rWw_Cu4Q\\":{\\"token\\":\\"$2a$10$vmKUzllRHPjUf7.YxWFXv.F.nQs8zuei/WsYqmbST0xBuRJt.Y3wO\\",\\"expiry\\":1659514240},\\"FoolFpPFtA5FScMRqIkv4g\\":{\\"token\\":\\"$2a$10$CNo9EyVJHG9yrLEGFSuJke3yVGuhK8q8pgPGOreM3A4hTzHPXViS.\\",\\"expiry\\":1659535667},\\"DJ3LzF531vV1HcM_enPjSA\\":{\\"token\\":\\"$2a$10$CE7tZw5tdgPIhuUdTsomN.PmuYOsJcdRNT5qwl2/GBgBbAw3GVCwu\\",\\"expiry\\":1659540268},\\"i0UpG0aWooHvUTGQF1ckxg\\":{\\"token\\":\\"$2a$10$Rr32CutGeZDIpfimvm77lOPW16B129c7EplAwFzLVFkLvDA9aUwti\\",\\"expiry\\":1659570528},\\"Vpu2ySPKUoZrX_VXApVVGQ\\":{\\"token\\":\\"$2a$10$FQoT6blyWjRDteY9QvjgauH0CwvbM/5ndD4wW8ab9rNUVuagsSE92\\",\\"expiry\\":1659774466}}"	2022-06-03 07:01:05.138851	2022-06-07 01:45:39.386464	6SqP6CfSfB9A25GWpHmHtqBa	0	{"is_ct_labels_open": false, "is_conv_actions_open": true, "is_conv_details_open": false, "is_ct_prev_conv_open": true, "is_previous_conv_open": true, "is_ct_custom_attr_open": false, "is_contact_attributes_open": true, "display_rich_content_editor": false}	{}	SuperAdmin	\N
2	email	landon@phpbroker.com	$2a$11$1JXKgr6U9wYHrF9bmWxxo.FMLaLigxSJKiQieWjJUL/7PqEbl.EwC	f5adc42acf8053768a3c9b3ecf01e7a0eb9f4e67a6fe1c2794220567ae51786b	2022-06-03 08:46:00.409611	\N	10	2022-06-06 04:04:27.316602	2022-06-06 03:09:18.480621	10.233.97.0	10.233.97.0	xtzDiEKeBpAL59D1qWSa	2022-06-03 07:01:05.137	2022-06-03 08:33:22.695293	\N	Landon Ngo	\N	landon@phpbroker.com	"{\\"UQ9k8aKF1LG1aSInOFLG1g\\":{\\"token\\":\\"$2a$10$3iPB/8TwAEiH4Pdbo3wF3O4TGH2MgJH8OPKuTXEhEeXMwn4tNCog2\\",\\"expiry\\":1659744297},\\"TPktqple_0iQ55D6meXqdQ\\":{\\"token\\":\\"$2a$10$.O/.1jkOUB8zNYcPe5yBI.unG9gbyY34Yc/LIlLdGY9XJ0PHa4apW\\",\\"expiry\\":1659744300},\\"SGjhnPm22ifPUjx9r5cO2Q\\":{\\"token\\":\\"$2a$10$OwCWKejZlrlvRAk5Flwx.epaCdHlGkNmGsKhDpIMMmgfDFSe3mznC\\",\\"expiry\\":1659751890},\\"C2KLlhky2WuZnNBGieagSg\\":{\\"token\\":\\"$2a$10$FHg8SiYPM.xs7LbdQMUlVuegieGvhGChHJG0ko60uSV6pcqzhzGHi\\",\\"expiry\\":1659752362},\\"WU1FxuJrIRbrt1Hl0RECKQ\\":{\\"token\\":\\"$2a$10$wZuCghySqgmi0g.QeWYTf.qGgVGc7tnY2GcwKQANMZtxCO7m3xQNW\\",\\"expiry\\":1659752622},\\"tdmpeQb20DV8Ffv8TrAIiQ\\":{\\"token\\":\\"$2a$10$85ljBeWK6vPZ9q2vwvReZugyRtPbr3/VOyycCY5UyrRTdVxSTVbfO\\",\\"expiry\\":1659753882},\\"eehaomgox7AppESsTud61g\\":{\\"token\\":\\"$2a$10$NoXZfueJpdmcAe9kNvG7H.HfEafoldIPmB4Si5LCd2Y1/ykjEaZN.\\",\\"expiry\\":1659754020},\\"Imlc5CDYrP_plQEUGyg3NQ\\":{\\"token\\":\\"$2a$10$PTMlAh1VYAJbOkS11oZtJ.1aTloSCRRssDkACV2etd7Cq1tfNlRJ2\\",\\"expiry\\":1659754294},\\"_sj9rk4kbc3p2Z2OJMVi2A\\":{\\"token\\":\\"$2a$10$ibrLqHfEYQUHHtnkk8F3VuGqgugSc9xw9wojRgezZjpnmfpMFcXlS\\",\\"expiry\\":1659755358}}"	2022-06-03 08:33:22.694495	2022-06-06 08:27:23.765712	2Bfnpcjgk4dqvLLhNJV3qqXb	0	{"is_ct_labels_open": true, "is_conv_actions_open": true, "is_conv_details_open": false, "is_ct_prev_conv_open": true, "is_previous_conv_open": false, "is_ct_custom_attr_open": true, "is_contact_attributes_open": true, "contact_sidebar_items_order": [{"name": "contact_attributes"}, {"name": "contact_labels"}, {"name": "previous_conversation"}], "display_rich_content_editor": false}	{}	\N	\N
\.


--
-- TOC entry 4146 (class 0 OID 20288)
-- Dependencies: 326
-- Data for Name: webhooks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.webhooks (id, account_id, inbox_id, url, created_at, updated_at, webhook_type, subscriptions) FROM stdin;
2	1	\N	http://33d2-14-241-247-213.ngrok.io/chatwoot	2022-06-07 08:23:27.677103	2022-06-08 00:15:50.08677	0	["conversation_created", "message_created", "message_updated", "webwidget_triggered", "conversation_updated", "conversation_status_changed"]
\.


--
-- TOC entry 4148 (class 0 OID 20300)
-- Dependencies: 328
-- Data for Name: working_hours; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.working_hours (id, inbox_id, account_id, day_of_week, closed_all_day, open_hour, open_minutes, close_hour, close_minutes, created_at, updated_at, open_all_day) FROM stdin;
1	1	1	0	t	\N	\N	\N	\N	2022-06-03 07:53:51.399231	2022-06-03 07:53:51.399231	f
2	1	1	1	f	9	0	17	0	2022-06-03 07:53:51.41274	2022-06-03 07:53:51.41274	f
3	1	1	2	f	9	0	17	0	2022-06-03 07:53:51.415792	2022-06-03 07:53:51.415792	f
4	1	1	3	f	9	0	17	0	2022-06-03 07:53:51.419584	2022-06-03 07:53:51.419584	f
5	1	1	4	f	9	0	17	0	2022-06-03 07:53:51.422718	2022-06-03 07:53:51.422718	f
6	1	1	5	f	9	0	17	0	2022-06-03 07:53:51.427462	2022-06-03 07:53:51.427462	f
7	1	1	6	t	\N	\N	\N	\N	2022-06-03 07:53:51.431716	2022-06-03 07:53:51.431716	f
\.


--
-- TOC entry 4215 (class 0 OID 0)
-- Dependencies: 215
-- Name: access_tokens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.access_tokens_id_seq', 2, true);


--
-- TOC entry 4216 (class 0 OID 0)
-- Dependencies: 217
-- Name: account_users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.account_users_id_seq', 2, true);


--
-- TOC entry 4217 (class 0 OID 0)
-- Dependencies: 219
-- Name: accounts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.accounts_id_seq', 1, true);


--
-- TOC entry 4218 (class 0 OID 0)
-- Dependencies: 221
-- Name: action_mailbox_inbound_emails_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.action_mailbox_inbound_emails_id_seq', 1, false);


--
-- TOC entry 4219 (class 0 OID 0)
-- Dependencies: 223
-- Name: active_storage_attachments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.active_storage_attachments_id_seq', 8, true);


--
-- TOC entry 4220 (class 0 OID 0)
-- Dependencies: 225
-- Name: active_storage_blobs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.active_storage_blobs_id_seq', 8, true);


--
-- TOC entry 4221 (class 0 OID 0)
-- Dependencies: 227
-- Name: active_storage_variant_records_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.active_storage_variant_records_id_seq', 1, false);


--
-- TOC entry 4222 (class 0 OID 0)
-- Dependencies: 229
-- Name: agent_bot_inboxes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.agent_bot_inboxes_id_seq', 1, false);


--
-- TOC entry 4223 (class 0 OID 0)
-- Dependencies: 231
-- Name: agent_bots_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.agent_bots_id_seq', 1, false);


--
-- TOC entry 4224 (class 0 OID 0)
-- Dependencies: 233
-- Name: attachments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.attachments_id_seq', 2, true);


--
-- TOC entry 4225 (class 0 OID 0)
-- Dependencies: 235
-- Name: automation_rules_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.automation_rules_id_seq', 7, true);


--
-- TOC entry 4226 (class 0 OID 0)
-- Dependencies: 214
-- Name: camp_dpid_seq_1; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.camp_dpid_seq_1', 2, true);


--
-- TOC entry 4227 (class 0 OID 0)
-- Dependencies: 237
-- Name: campaigns_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.campaigns_id_seq', 2, true);


--
-- TOC entry 4228 (class 0 OID 0)
-- Dependencies: 239
-- Name: canned_responses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.canned_responses_id_seq', 1, true);


--
-- TOC entry 4229 (class 0 OID 0)
-- Dependencies: 241
-- Name: channel_api_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.channel_api_id_seq', 1, true);


--
-- TOC entry 4230 (class 0 OID 0)
-- Dependencies: 243
-- Name: channel_email_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.channel_email_id_seq', 1, false);


--
-- TOC entry 4231 (class 0 OID 0)
-- Dependencies: 245
-- Name: channel_facebook_pages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.channel_facebook_pages_id_seq', 1, false);


--
-- TOC entry 4232 (class 0 OID 0)
-- Dependencies: 247
-- Name: channel_line_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.channel_line_id_seq', 1, false);


--
-- TOC entry 4233 (class 0 OID 0)
-- Dependencies: 249
-- Name: channel_sms_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.channel_sms_id_seq', 1, false);


--
-- TOC entry 4234 (class 0 OID 0)
-- Dependencies: 251
-- Name: channel_telegram_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.channel_telegram_id_seq', 1, false);


--
-- TOC entry 4235 (class 0 OID 0)
-- Dependencies: 253
-- Name: channel_twilio_sms_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.channel_twilio_sms_id_seq', 1, false);


--
-- TOC entry 4236 (class 0 OID 0)
-- Dependencies: 255
-- Name: channel_twitter_profiles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.channel_twitter_profiles_id_seq', 1, false);


--
-- TOC entry 4237 (class 0 OID 0)
-- Dependencies: 257
-- Name: channel_web_widgets_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.channel_web_widgets_id_seq', 1, true);


--
-- TOC entry 4238 (class 0 OID 0)
-- Dependencies: 259
-- Name: channel_whatsapp_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.channel_whatsapp_id_seq', 1, false);


--
-- TOC entry 4239 (class 0 OID 0)
-- Dependencies: 261
-- Name: contact_inboxes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.contact_inboxes_id_seq', 108, true);


--
-- TOC entry 4240 (class 0 OID 0)
-- Dependencies: 263
-- Name: contacts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.contacts_id_seq', 114, true);


--
-- TOC entry 4241 (class 0 OID 0)
-- Dependencies: 213
-- Name: conv_dpid_seq_1; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.conv_dpid_seq_1', 40, true);


--
-- TOC entry 4242 (class 0 OID 0)
-- Dependencies: 265
-- Name: conversations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.conversations_id_seq', 40, true);


--
-- TOC entry 4243 (class 0 OID 0)
-- Dependencies: 267
-- Name: csat_survey_responses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.csat_survey_responses_id_seq', 1, false);


--
-- TOC entry 4244 (class 0 OID 0)
-- Dependencies: 269
-- Name: custom_attribute_definitions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.custom_attribute_definitions_id_seq', 2, true);


--
-- TOC entry 4245 (class 0 OID 0)
-- Dependencies: 271
-- Name: custom_filters_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.custom_filters_id_seq', 1, false);


--
-- TOC entry 4246 (class 0 OID 0)
-- Dependencies: 273
-- Name: data_imports_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.data_imports_id_seq', 1, false);


--
-- TOC entry 4247 (class 0 OID 0)
-- Dependencies: 275
-- Name: email_templates_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.email_templates_id_seq', 1, false);


--
-- TOC entry 4248 (class 0 OID 0)
-- Dependencies: 277
-- Name: inbox_members_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.inbox_members_id_seq', 2, true);


--
-- TOC entry 4249 (class 0 OID 0)
-- Dependencies: 279
-- Name: inboxes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.inboxes_id_seq', 2, true);


--
-- TOC entry 4250 (class 0 OID 0)
-- Dependencies: 281
-- Name: installation_configs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.installation_configs_id_seq', 27, true);


--
-- TOC entry 4251 (class 0 OID 0)
-- Dependencies: 283
-- Name: integrations_hooks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.integrations_hooks_id_seq', 1, false);


--
-- TOC entry 4252 (class 0 OID 0)
-- Dependencies: 285
-- Name: kbase_articles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.kbase_articles_id_seq', 1, false);


--
-- TOC entry 4253 (class 0 OID 0)
-- Dependencies: 287
-- Name: kbase_categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.kbase_categories_id_seq', 1, false);


--
-- TOC entry 4254 (class 0 OID 0)
-- Dependencies: 289
-- Name: kbase_folders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.kbase_folders_id_seq', 1, false);


--
-- TOC entry 4255 (class 0 OID 0)
-- Dependencies: 291
-- Name: kbase_portals_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.kbase_portals_id_seq', 1, false);


--
-- TOC entry 4256 (class 0 OID 0)
-- Dependencies: 293
-- Name: labels_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.labels_id_seq', 3, true);


--
-- TOC entry 4257 (class 0 OID 0)
-- Dependencies: 295
-- Name: mentions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.mentions_id_seq', 1, false);


--
-- TOC entry 4258 (class 0 OID 0)
-- Dependencies: 297
-- Name: messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.messages_id_seq', 225, true);


--
-- TOC entry 4259 (class 0 OID 0)
-- Dependencies: 299
-- Name: notes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notes_id_seq', 1, true);


--
-- TOC entry 4260 (class 0 OID 0)
-- Dependencies: 301
-- Name: notification_settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notification_settings_id_seq', 2, true);


--
-- TOC entry 4261 (class 0 OID 0)
-- Dependencies: 303
-- Name: notification_subscriptions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notification_subscriptions_id_seq', 1, false);


--
-- TOC entry 4262 (class 0 OID 0)
-- Dependencies: 305
-- Name: notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notifications_id_seq', 1, false);


--
-- TOC entry 4263 (class 0 OID 0)
-- Dependencies: 307
-- Name: platform_app_permissibles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.platform_app_permissibles_id_seq', 1, false);


--
-- TOC entry 4264 (class 0 OID 0)
-- Dependencies: 309
-- Name: platform_apps_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.platform_apps_id_seq', 1, false);


--
-- TOC entry 4265 (class 0 OID 0)
-- Dependencies: 311
-- Name: reporting_events_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reporting_events_id_seq', 39, true);


--
-- TOC entry 4266 (class 0 OID 0)
-- Dependencies: 313
-- Name: taggings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.taggings_id_seq', 16, true);


--
-- TOC entry 4267 (class 0 OID 0)
-- Dependencies: 315
-- Name: tags_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tags_id_seq', 3, true);


--
-- TOC entry 4268 (class 0 OID 0)
-- Dependencies: 317
-- Name: team_members_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.team_members_id_seq', 5, true);


--
-- TOC entry 4269 (class 0 OID 0)
-- Dependencies: 319
-- Name: teams_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.teams_id_seq', 3, true);


--
-- TOC entry 4270 (class 0 OID 0)
-- Dependencies: 321
-- Name: telegram_bots_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.telegram_bots_id_seq', 1, false);


--
-- TOC entry 4271 (class 0 OID 0)
-- Dependencies: 323
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 2, true);


--
-- TOC entry 4272 (class 0 OID 0)
-- Dependencies: 325
-- Name: webhooks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.webhooks_id_seq', 2, true);


--
-- TOC entry 4273 (class 0 OID 0)
-- Dependencies: 327
-- Name: working_hours_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.working_hours_id_seq', 14, true);


--
-- TOC entry 3625 (class 2606 OID 19594)
-- Name: access_tokens access_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.access_tokens
    ADD CONSTRAINT access_tokens_pkey PRIMARY KEY (id);


--
-- TOC entry 3629 (class 2606 OID 19606)
-- Name: account_users account_users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_users
    ADD CONSTRAINT account_users_pkey PRIMARY KEY (id);


--
-- TOC entry 3634 (class 2606 OID 19622)
-- Name: accounts accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_pkey PRIMARY KEY (id);


--
-- TOC entry 3636 (class 2606 OID 19632)
-- Name: action_mailbox_inbound_emails action_mailbox_inbound_emails_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.action_mailbox_inbound_emails
    ADD CONSTRAINT action_mailbox_inbound_emails_pkey PRIMARY KEY (id);


--
-- TOC entry 3639 (class 2606 OID 19642)
-- Name: active_storage_attachments active_storage_attachments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.active_storage_attachments
    ADD CONSTRAINT active_storage_attachments_pkey PRIMARY KEY (id);


--
-- TOC entry 3643 (class 2606 OID 19653)
-- Name: active_storage_blobs active_storage_blobs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.active_storage_blobs
    ADD CONSTRAINT active_storage_blobs_pkey PRIMARY KEY (id);


--
-- TOC entry 3646 (class 2606 OID 19663)
-- Name: active_storage_variant_records active_storage_variant_records_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.active_storage_variant_records
    ADD CONSTRAINT active_storage_variant_records_pkey PRIMARY KEY (id);


--
-- TOC entry 3649 (class 2606 OID 19672)
-- Name: agent_bot_inboxes agent_bot_inboxes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agent_bot_inboxes
    ADD CONSTRAINT agent_bot_inboxes_pkey PRIMARY KEY (id);


--
-- TOC entry 3651 (class 2606 OID 19681)
-- Name: agent_bots agent_bots_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agent_bots
    ADD CONSTRAINT agent_bots_pkey PRIMARY KEY (id);


--
-- TOC entry 3861 (class 2606 OID 20461)
-- Name: ar_internal_metadata ar_internal_metadata_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ar_internal_metadata
    ADD CONSTRAINT ar_internal_metadata_pkey PRIMARY KEY (key);


--
-- TOC entry 3654 (class 2606 OID 19694)
-- Name: attachments attachments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attachments
    ADD CONSTRAINT attachments_pkey PRIMARY KEY (id);


--
-- TOC entry 3656 (class 2606 OID 19706)
-- Name: automation_rules automation_rules_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.automation_rules
    ADD CONSTRAINT automation_rules_pkey PRIMARY KEY (id);


--
-- TOC entry 3659 (class 2606 OID 19722)
-- Name: campaigns campaigns_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.campaigns
    ADD CONSTRAINT campaigns_pkey PRIMARY KEY (id);


--
-- TOC entry 3666 (class 2606 OID 19736)
-- Name: canned_responses canned_responses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.canned_responses
    ADD CONSTRAINT canned_responses_pkey PRIMARY KEY (id);


--
-- TOC entry 3668 (class 2606 OID 19746)
-- Name: channel_api channel_api_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.channel_api
    ADD CONSTRAINT channel_api_pkey PRIMARY KEY (id);


--
-- TOC entry 3672 (class 2606 OID 19773)
-- Name: channel_email channel_email_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.channel_email
    ADD CONSTRAINT channel_email_pkey PRIMARY KEY (id);


--
-- TOC entry 3676 (class 2606 OID 19784)
-- Name: channel_facebook_pages channel_facebook_pages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.channel_facebook_pages
    ADD CONSTRAINT channel_facebook_pages_pkey PRIMARY KEY (id);


--
-- TOC entry 3680 (class 2606 OID 19795)
-- Name: channel_line channel_line_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.channel_line
    ADD CONSTRAINT channel_line_pkey PRIMARY KEY (id);


--
-- TOC entry 3683 (class 2606 OID 19807)
-- Name: channel_sms channel_sms_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.channel_sms
    ADD CONSTRAINT channel_sms_pkey PRIMARY KEY (id);


--
-- TOC entry 3686 (class 2606 OID 19817)
-- Name: channel_telegram channel_telegram_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.channel_telegram
    ADD CONSTRAINT channel_telegram_pkey PRIMARY KEY (id);


--
-- TOC entry 3689 (class 2606 OID 19828)
-- Name: channel_twilio_sms channel_twilio_sms_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.channel_twilio_sms
    ADD CONSTRAINT channel_twilio_sms_pkey PRIMARY KEY (id);


--
-- TOC entry 3693 (class 2606 OID 19840)
-- Name: channel_twitter_profiles channel_twitter_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.channel_twitter_profiles
    ADD CONSTRAINT channel_twitter_profiles_pkey PRIMARY KEY (id);


--
-- TOC entry 3696 (class 2606 OID 19857)
-- Name: channel_web_widgets channel_web_widgets_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.channel_web_widgets
    ADD CONSTRAINT channel_web_widgets_pkey PRIMARY KEY (id);


--
-- TOC entry 3700 (class 2606 OID 19871)
-- Name: channel_whatsapp channel_whatsapp_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.channel_whatsapp
    ADD CONSTRAINT channel_whatsapp_pkey PRIMARY KEY (id);


--
-- TOC entry 3703 (class 2606 OID 19882)
-- Name: contact_inboxes contact_inboxes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contact_inboxes
    ADD CONSTRAINT contact_inboxes_pkey PRIMARY KEY (id);


--
-- TOC entry 3710 (class 2606 OID 19898)
-- Name: contacts contacts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contacts
    ADD CONSTRAINT contacts_pkey PRIMARY KEY (id);


--
-- TOC entry 3716 (class 2606 OID 19916)
-- Name: conversations conversations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conversations
    ADD CONSTRAINT conversations_pkey PRIMARY KEY (id);


--
-- TOC entry 3726 (class 2606 OID 19933)
-- Name: csat_survey_responses csat_survey_responses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.csat_survey_responses
    ADD CONSTRAINT csat_survey_responses_pkey PRIMARY KEY (id);


--
-- TOC entry 3734 (class 2606 OID 19950)
-- Name: custom_attribute_definitions custom_attribute_definitions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.custom_attribute_definitions
    ADD CONSTRAINT custom_attribute_definitions_pkey PRIMARY KEY (id);


--
-- TOC entry 3737 (class 2606 OID 19963)
-- Name: custom_filters custom_filters_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.custom_filters
    ADD CONSTRAINT custom_filters_pkey PRIMARY KEY (id);


--
-- TOC entry 3741 (class 2606 OID 19975)
-- Name: data_imports data_imports_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.data_imports
    ADD CONSTRAINT data_imports_pkey PRIMARY KEY (id);


--
-- TOC entry 3744 (class 2606 OID 19987)
-- Name: email_templates email_templates_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.email_templates
    ADD CONSTRAINT email_templates_pkey PRIMARY KEY (id);


--
-- TOC entry 3747 (class 2606 OID 19995)
-- Name: inbox_members inbox_members_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inbox_members
    ADD CONSTRAINT inbox_members_pkey PRIMARY KEY (id);


--
-- TOC entry 3751 (class 2606 OID 20013)
-- Name: inboxes inboxes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inboxes
    ADD CONSTRAINT inboxes_pkey PRIMARY KEY (id);


--
-- TOC entry 3756 (class 2606 OID 20025)
-- Name: installation_configs installation_configs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.installation_configs
    ADD CONSTRAINT installation_configs_pkey PRIMARY KEY (id);


--
-- TOC entry 3758 (class 2606 OID 20039)
-- Name: integrations_hooks integrations_hooks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.integrations_hooks
    ADD CONSTRAINT integrations_hooks_pkey PRIMARY KEY (id);


--
-- TOC entry 3760 (class 2606 OID 20048)
-- Name: kbase_articles kbase_articles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kbase_articles
    ADD CONSTRAINT kbase_articles_pkey PRIMARY KEY (id);


--
-- TOC entry 3763 (class 2606 OID 20058)
-- Name: kbase_categories kbase_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kbase_categories
    ADD CONSTRAINT kbase_categories_pkey PRIMARY KEY (id);


--
-- TOC entry 3765 (class 2606 OID 20068)
-- Name: kbase_folders kbase_folders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kbase_folders
    ADD CONSTRAINT kbase_folders_pkey PRIMARY KEY (id);


--
-- TOC entry 3768 (class 2606 OID 20078)
-- Name: kbase_portals kbase_portals_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kbase_portals
    ADD CONSTRAINT kbase_portals_pkey PRIMARY KEY (id);


--
-- TOC entry 3772 (class 2606 OID 20089)
-- Name: labels labels_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.labels
    ADD CONSTRAINT labels_pkey PRIMARY KEY (id);


--
-- TOC entry 3778 (class 2606 OID 20098)
-- Name: mentions mentions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mentions
    ADD CONSTRAINT mentions_pkey PRIMARY KEY (id);


--
-- TOC entry 3786 (class 2606 OID 20117)
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);


--
-- TOC entry 3791 (class 2606 OID 20132)
-- Name: notes notes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notes
    ADD CONSTRAINT notes_pkey PRIMARY KEY (id);


--
-- TOC entry 3794 (class 2606 OID 20144)
-- Name: notification_settings notification_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification_settings
    ADD CONSTRAINT notification_settings_pkey PRIMARY KEY (id);


--
-- TOC entry 3798 (class 2606 OID 20155)
-- Name: notification_subscriptions notification_subscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification_subscriptions
    ADD CONSTRAINT notification_subscriptions_pkey PRIMARY KEY (id);


--
-- TOC entry 3802 (class 2606 OID 20166)
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- TOC entry 3808 (class 2606 OID 20179)
-- Name: platform_app_permissibles platform_app_permissibles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.platform_app_permissibles
    ADD CONSTRAINT platform_app_permissibles_pkey PRIMARY KEY (id);


--
-- TOC entry 3811 (class 2606 OID 20191)
-- Name: platform_apps platform_apps_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.platform_apps
    ADD CONSTRAINT platform_apps_pkey PRIMARY KEY (id);


--
-- TOC entry 3819 (class 2606 OID 20200)
-- Name: reporting_events reporting_events_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reporting_events
    ADD CONSTRAINT reporting_events_pkey PRIMARY KEY (id);


--
-- TOC entry 3859 (class 2606 OID 20454)
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- TOC entry 3830 (class 2606 OID 20215)
-- Name: taggings taggings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.taggings
    ADD CONSTRAINT taggings_pkey PRIMARY KEY (id);


--
-- TOC entry 3833 (class 2606 OID 20234)
-- Name: tags tags_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_pkey PRIMARY KEY (id);


--
-- TOC entry 3838 (class 2606 OID 20242)
-- Name: team_members team_members_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.team_members
    ADD CONSTRAINT team_members_pkey PRIMARY KEY (id);


--
-- TOC entry 3842 (class 2606 OID 20255)
-- Name: teams teams_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teams
    ADD CONSTRAINT teams_pkey PRIMARY KEY (id);


--
-- TOC entry 3844 (class 2606 OID 20266)
-- Name: telegram_bots telegram_bots_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.telegram_bots
    ADD CONSTRAINT telegram_bots_pkey PRIMARY KEY (id);


--
-- TOC entry 3850 (class 2606 OID 20282)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 3853 (class 2606 OID 20297)
-- Name: webhooks webhooks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.webhooks
    ADD CONSTRAINT webhooks_pkey PRIMARY KEY (id);


--
-- TOC entry 3857 (class 2606 OID 20307)
-- Name: working_hours working_hours_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.working_hours
    ADD CONSTRAINT working_hours_pkey PRIMARY KEY (id);


--
-- TOC entry 3732 (class 1259 OID 19952)
-- Name: attribute_key_model_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX attribute_key_model_index ON public.custom_attribute_definitions USING btree (attribute_key, attribute_model, account_id);


--
-- TOC entry 3792 (class 1259 OID 20145)
-- Name: by_account_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX by_account_user ON public.notification_settings USING btree (account_id, user_id);


--
-- TOC entry 3626 (class 1259 OID 19595)
-- Name: index_access_tokens_on_owner_type_and_owner_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX index_access_tokens_on_owner_type_and_owner_id ON public.access_tokens USING btree (owner_type, owner_id);


--
-- TOC entry 3627 (class 1259 OID 19596)
-- Name: index_access_tokens_on_token; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX index_access_tokens_on_token ON public.access_tokens USING btree (token);


--
-- TOC entry 3630 (class 1259 OID 19608)
-- Name: index_account_users_on_account_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX index_account_users_on_account_id ON public.account_users USING btree (account_id);


--
-- TOC entry 3631 (class 1259 OID 19609)
-- Name: index_account_users_on_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX index_account_users_on_user_id ON public.account_users USING btree (user_id);


--
-- TOC entry 3637 (class 1259 OID 19633)
-- Name: index_action_mailbox_inbound_emails_uniqueness; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX index_action_mailbox_inbound_emails_uniqueness ON public.action_mailbox_inbound_emails USING btree (message_id, message_checksum);


--
-- TOC entry 3640 (class 1259 OID 19643)
-- Name: index_active_storage_attachments_on_blob_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX index_active_storage_attachments_on_blob_id ON public.active_storage_attachments USING btree (blob_id);


--
-- TOC entry 3641 (class 1259 OID 19644)
-- Name: index_active_storage_attachments_uniqueness; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX index_active_storage_attachments_uniqueness ON public.active_storage_attachments USING btree (record_type, record_id, name, blob_id);


--
-- TOC entry 3644 (class 1259 OID 19654)
-- Name: index_active_storage_blobs_on_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX index_active_storage_blobs_on_key ON public.active_storage_blobs USING btree (key);


--
-- TOC entry 3647 (class 1259 OID 19664)
-- Name: index_active_storage_variant_records_uniqueness; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX index_active_storage_variant_records_uniqueness ON public.active_storage_variant_records USING btree (blob_id, variation_digest);


--
-- TOC entry 3652 (class 1259 OID 19682)
-- Name: index_agent_bots_on_account_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX index_agent_bots_on_account_id ON public.agent_bots USING btree (account_id);


--
-- TOC entry 3657 (class 1259 OID 19707)
-- Name: index_automation_rules_on_account_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX index_automation_rules_on_account_id ON public.automation_rules USING btree (account_id);


--
-- TOC entry 3660 (class 1259 OID 19723)
-- Name: index_campaigns_on_account_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX index_campaigns_on_account_id ON public.campaigns USING btree (account_id);


--
-- TOC entry 3661 (class 1259 OID 19724)
-- Name: index_campaigns_on_campaign_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX index_campaigns_on_campaign_status ON public.campaigns USING btree (campaign_status);


--
-- TOC entry 3662 (class 1259 OID 19725)
-- Name: index_campaigns_on_campaign_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX index_campaigns_on_campaign_type ON public.campaigns USING btree (campaign_type);


--
-- TOC entry 3663 (class 1259 OID 19726)
-- Name: index_campaigns_on_inbox_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX index_campaigns_on_inbox_id ON public.campaigns USING btree (inbox_id);


--
-- TOC entry 3664 (class 1259 OID 19727)
-- Name: index_campaigns_on_scheduled_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX index_campaigns_on_scheduled_at ON public.campaigns USING btree (scheduled_at);


--
-- TOC entry 3669 (class 1259 OID 19747)
-- Name: index_channel_api_on_hmac_token; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX index_channel_api_on_hmac_token ON public.channel_api USING btree (hmac_token);


--
-- TOC entry 3670 (class 1259 OID 19748)
-- Name: index_channel_api_on_identifier; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX index_channel_api_on_identifier ON public.channel_api USING btree (identifier);


--
-- TOC entry 3673 (class 1259 OID 19774)
-- Name: index_channel_email_on_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX index_channel_email_on_email ON public.channel_email USING btree (email);


--
-- TOC entry 3674 (class 1259 OID 19775)
-- Name: index_channel_email_on_forward_to_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX index_channel_email_on_forward_to_email ON public.channel_email USING btree (forward_to_email);


--
-- TOC entry 3677 (class 1259 OID 19786)
-- Name: index_channel_facebook_pages_on_page_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX index_channel_facebook_pages_on_page_id ON public.channel_facebook_pages USING btree (page_id);


--
-- TOC entry 3678 (class 1259 OID 19785)
-- Name: index_channel_facebook_pages_on_page_id_and_account_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX index_channel_facebook_pages_on_page_id_and_account_id ON public.channel_facebook_pages USING btree (page_id, account_id);


--
-- TOC entry 3681 (class 1259 OID 19796)
-- Name: index_channel_line_on_line_channel_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX index_channel_line_on_line_channel_id ON public.channel_line USING btree (line_channel_id);


--
-- TOC entry 3684 (class 1259 OID 19808)
-- Name: index_channel_sms_on_phone_number; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX index_channel_sms_on_phone_number ON public.channel_sms USING btree (phone_number);


--
-- TOC entry 3687 (class 1259 OID 19818)
-- Name: index_channel_telegram_on_bot_token; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX index_channel_telegram_on_bot_token ON public.channel_telegram USING btree (bot_token);


--
-- TOC entry 3690 (class 1259 OID 19829)
-- Name: index_channel_twilio_sms_on_account_sid_and_phone_number; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX index_channel_twilio_sms_on_account_sid_and_phone_number ON public.channel_twilio_sms USING btree (account_sid, phone_number);


--
-- TOC entry 3691 (class 1259 OID 19830)
-- Name: index_channel_twilio_sms_on_phone_number; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX index_channel_twilio_sms_on_phone_number ON public.channel_twilio_sms USING btree (phone_number);


--
-- TOC entry 3694 (class 1259 OID 19841)
-- Name: index_channel_twitter_profiles_on_account_id_and_profile_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX index_channel_twitter_profiles_on_account_id_and_profile_id ON public.channel_twitter_profiles USING btree (account_id, profile_id);


--
-- TOC entry 3697 (class 1259 OID 19858)
-- Name: index_channel_web_widgets_on_hmac_token; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX index_channel_web_widgets_on_hmac_token ON public.channel_web_widgets USING btree (hmac_token);


--
-- TOC entry 3698 (class 1259 OID 19859)
-- Name: index_channel_web_widgets_on_website_token; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX index_channel_web_widgets_on_website_token ON public.channel_web_widgets USING btree (website_token);


--
-- TOC entry 3701 (class 1259 OID 19872)
-- Name: index_channel_whatsapp_on_phone_number; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX index_channel_whatsapp_on_phone_number ON public.channel_whatsapp USING btree (phone_number);


--
-- TOC entry 3704 (class 1259 OID 19883)
-- Name: index_contact_inboxes_on_contact_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX index_contact_inboxes_on_contact_id ON public.contact_inboxes USING btree (contact_id);


--
-- TOC entry 3705 (class 1259 OID 19885)
-- Name: index_contact_inboxes_on_inbox_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX index_contact_inboxes_on_inbox_id ON public.contact_inboxes USING btree (inbox_id);


--
-- TOC entry 3706 (class 1259 OID 19884)
-- Name: index_contact_inboxes_on_inbox_id_and_source_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX index_contact_inboxes_on_inbox_id_and_source_id ON public.contact_inboxes USING btree (inbox_id, source_id);


--
-- TOC entry 3707 (class 1259 OID 19886)
-- Name: index_contact_inboxes_on_pubsub_token; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX index_contact_inboxes_on_pubsub_token ON public.contact_inboxes USING btree (pubsub_token);


--
-- TOC entry 3708 (class 1259 OID 19887)
-- Name: index_contact_inboxes_on_source_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX index_contact_inboxes_on_source_id ON public.contact_inboxes USING btree (source_id);


--
-- TOC entry 3711 (class 1259 OID 19899)
-- Name: index_contacts_on_account_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX index_contacts_on_account_id ON public.contacts USING btree (account_id);


--
-- TOC entry 3712 (class 1259 OID 19902)
-- Name: index_contacts_on_phone_number_and_account_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX index_contacts_on_phone_number_and_account_id ON public.contacts USING btree (phone_number, account_id);


--
-- TOC entry 3717 (class 1259 OID 19918)
-- Name: index_conversations_on_account_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX index_conversations_on_account_id ON public.conversations USING btree (account_id);


--
-- TOC entry 3718 (class 1259 OID 19917)
-- Name: index_conversations_on_account_id_and_display_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX index_conversations_on_account_id_and_display_id ON public.conversations USING btree (account_id, display_id);


--
-- TOC entry 3719 (class 1259 OID 19919)
-- Name: index_conversations_on_assignee_id_and_account_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX index_conversations_on_assignee_id_and_account_id ON public.conversations USING btree (assignee_id, account_id);


--
-- TOC entry 3720 (class 1259 OID 19920)
-- Name: index_conversations_on_campaign_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX index_conversations_on_campaign_id ON public.conversations USING btree (campaign_id);


--
-- TOC entry 3721 (class 1259 OID 19921)
-- Name: index_conversations_on_contact_inbox_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX index_conversations_on_contact_inbox_id ON public.conversations USING btree (contact_inbox_id);


--
-- TOC entry 3722 (class 1259 OID 19922)
-- Name: index_conversations_on_last_activity_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX index_conversations_on_last_activity_at ON public.conversations USING btree (last_activity_at);


--
-- TOC entry 3723 (class 1259 OID 19923)
-- Name: index_conversations_on_status_and_account_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX index_conversations_on_status_and_account_id ON public.conversations USING btree (status, account_id);


--
-- TOC entry 3724 (class 1259 OID 19924)
-- Name: index_conversations_on_team_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX index_conversations_on_team_id ON public.conversations USING btree (team_id);


--
-- TOC entry 3727 (class 1259 OID 19934)
-- Name: index_csat_survey_responses_on_account_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX index_csat_survey_responses_on_account_id ON public.csat_survey_responses USING btree (account_id);


--
-- TOC entry 3728 (class 1259 OID 19935)
-- Name: index_csat_survey_responses_on_assigned_agent_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX index_csat_survey_responses_on_assigned_agent_id ON public.csat_survey_responses USING btree (assigned_agent_id);


--
-- TOC entry 3729 (class 1259 OID 19936)
-- Name: index_csat_survey_responses_on_contact_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX index_csat_survey_responses_on_contact_id ON public.csat_survey_responses USING btree (contact_id);


--
-- TOC entry 3730 (class 1259 OID 19937)
-- Name: index_csat_survey_responses_on_conversation_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX index_csat_survey_responses_on_conversation_id ON public.csat_survey_responses USING btree (conversation_id);


--
-- TOC entry 3731 (class 1259 OID 19938)
-- Name: index_csat_survey_responses_on_message_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX index_csat_survey_responses_on_message_id ON public.csat_survey_responses USING btree (message_id);


--
-- TOC entry 3735 (class 1259 OID 19951)
-- Name: index_custom_attribute_definitions_on_account_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX index_custom_attribute_definitions_on_account_id ON public.custom_attribute_definitions USING btree (account_id);


--
-- TOC entry 3738 (class 1259 OID 19964)
-- Name: index_custom_filters_on_account_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX index_custom_filters_on_account_id ON public.custom_filters USING btree (account_id);


--
-- TOC entry 3739 (class 1259 OID 19965)
-- Name: index_custom_filters_on_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX index_custom_filters_on_user_id ON public.custom_filters USING btree (user_id);


--
-- TOC entry 3742 (class 1259 OID 19976)
-- Name: index_data_imports_on_account_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX index_data_imports_on_account_id ON public.data_imports USING btree (account_id);


--
-- TOC entry 3745 (class 1259 OID 19988)
-- Name: index_email_templates_on_name_and_account_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX index_email_templates_on_name_and_account_id ON public.email_templates USING btree (name, account_id);


--
-- TOC entry 3748 (class 1259 OID 19997)
-- Name: index_inbox_members_on_inbox_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX index_inbox_members_on_inbox_id ON public.inbox_members USING btree (inbox_id);


--
-- TOC entry 3749 (class 1259 OID 19996)
-- Name: index_inbox_members_on_inbox_id_and_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX index_inbox_members_on_inbox_id_and_user_id ON public.inbox_members USING btree (inbox_id, user_id);


--
-- TOC entry 3752 (class 1259 OID 20014)
-- Name: index_inboxes_on_account_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX index_inboxes_on_account_id ON public.inboxes USING btree (account_id);


--
-- TOC entry 3753 (class 1259 OID 20027)
-- Name: index_installation_configs_on_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX index_installation_configs_on_name ON public.installation_configs USING btree (name);


--
-- TOC entry 3754 (class 1259 OID 20026)
-- Name: index_installation_configs_on_name_and_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX index_installation_configs_on_name_and_created_at ON public.installation_configs USING btree (name, created_at);


--
-- TOC entry 3761 (class 1259 OID 20059)
-- Name: index_kbase_categories_on_locale_and_account_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX index_kbase_categories_on_locale_and_account_id ON public.kbase_categories USING btree (locale, account_id);


--
-- TOC entry 3766 (class 1259 OID 20079)
-- Name: index_kbase_portals_on_slug; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX index_kbase_portals_on_slug ON public.kbase_portals USING btree (slug);


--
-- TOC entry 3769 (class 1259 OID 20090)
-- Name: index_labels_on_account_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX index_labels_on_account_id ON public.labels USING btree (account_id);


--
-- TOC entry 3770 (class 1259 OID 20091)
-- Name: index_labels_on_title_and_account_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX index_labels_on_title_and_account_id ON public.labels USING btree (title, account_id);


--
-- TOC entry 3773 (class 1259 OID 20099)
-- Name: index_mentions_on_account_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX index_mentions_on_account_id ON public.mentions USING btree (account_id);


--
-- TOC entry 3774 (class 1259 OID 20100)
-- Name: index_mentions_on_conversation_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX index_mentions_on_conversation_id ON public.mentions USING btree (conversation_id);


--
-- TOC entry 3775 (class 1259 OID 20102)
-- Name: index_mentions_on_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX index_mentions_on_user_id ON public.mentions USING btree (user_id);


--
-- TOC entry 3776 (class 1259 OID 20101)
-- Name: index_mentions_on_user_id_and_conversation_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX index_mentions_on_user_id_and_conversation_id ON public.mentions USING btree (user_id, conversation_id);


--
-- TOC entry 3779 (class 1259 OID 20119)
-- Name: index_messages_on_account_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX index_messages_on_account_id ON public.messages USING btree (account_id);


--
-- TOC entry 3780 (class 1259 OID 20118)
-- Name: index_messages_on_additional_attributes_campaign_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX index_messages_on_additional_attributes_campaign_id ON public.messages USING gin (((additional_attributes -> 'campaign_id'::text)));


--
-- TOC entry 3781 (class 1259 OID 20120)
-- Name: index_messages_on_conversation_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX index_messages_on_conversation_id ON public.messages USING btree (conversation_id);


--
-- TOC entry 3782 (class 1259 OID 20121)
-- Name: index_messages_on_inbox_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX index_messages_on_inbox_id ON public.messages USING btree (inbox_id);


--
-- TOC entry 3783 (class 1259 OID 20122)
-- Name: index_messages_on_sender_type_and_sender_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX index_messages_on_sender_type_and_sender_id ON public.messages USING btree (sender_type, sender_id);


--
-- TOC entry 3784 (class 1259 OID 20123)
-- Name: index_messages_on_source_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX index_messages_on_source_id ON public.messages USING btree (source_id);


--
-- TOC entry 3787 (class 1259 OID 20133)
-- Name: index_notes_on_account_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX index_notes_on_account_id ON public.notes USING btree (account_id);


--
-- TOC entry 3788 (class 1259 OID 20134)
-- Name: index_notes_on_contact_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX index_notes_on_contact_id ON public.notes USING btree (contact_id);


--
-- TOC entry 3789 (class 1259 OID 20135)
-- Name: index_notes_on_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX index_notes_on_user_id ON public.notes USING btree (user_id);


--
-- TOC entry 3795 (class 1259 OID 20156)
-- Name: index_notification_subscriptions_on_identifier; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX index_notification_subscriptions_on_identifier ON public.notification_subscriptions USING btree (identifier);


--
-- TOC entry 3796 (class 1259 OID 20157)
-- Name: index_notification_subscriptions_on_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX index_notification_subscriptions_on_user_id ON public.notification_subscriptions USING btree (user_id);


--
-- TOC entry 3799 (class 1259 OID 20167)
-- Name: index_notifications_on_account_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX index_notifications_on_account_id ON public.notifications USING btree (account_id);


--
-- TOC entry 3800 (class 1259 OID 20170)
-- Name: index_notifications_on_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX index_notifications_on_user_id ON public.notifications USING btree (user_id);


--
-- TOC entry 3805 (class 1259 OID 20180)
-- Name: index_platform_app_permissibles_on_permissibles; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX index_platform_app_permissibles_on_permissibles ON public.platform_app_permissibles USING btree (permissible_type, permissible_id);


--
-- TOC entry 3806 (class 1259 OID 20182)
-- Name: index_platform_app_permissibles_on_platform_app_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX index_platform_app_permissibles_on_platform_app_id ON public.platform_app_permissibles USING btree (platform_app_id);


--
-- TOC entry 3812 (class 1259 OID 20201)
-- Name: index_reporting_events_on_account_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX index_reporting_events_on_account_id ON public.reporting_events USING btree (account_id);


--
-- TOC entry 3813 (class 1259 OID 20202)
-- Name: index_reporting_events_on_conversation_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX index_reporting_events_on_conversation_id ON public.reporting_events USING btree (conversation_id);


--
-- TOC entry 3814 (class 1259 OID 20203)
-- Name: index_reporting_events_on_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX index_reporting_events_on_created_at ON public.reporting_events USING btree (created_at);


--
-- TOC entry 3815 (class 1259 OID 20204)
-- Name: index_reporting_events_on_inbox_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX index_reporting_events_on_inbox_id ON public.reporting_events USING btree (inbox_id);


--
-- TOC entry 3816 (class 1259 OID 20205)
-- Name: index_reporting_events_on_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX index_reporting_events_on_name ON public.reporting_events USING btree (name);


--
-- TOC entry 3817 (class 1259 OID 20206)
-- Name: index_reporting_events_on_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX index_reporting_events_on_user_id ON public.reporting_events USING btree (user_id);


--
-- TOC entry 3820 (class 1259 OID 20216)
-- Name: index_taggings_on_context; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX index_taggings_on_context ON public.taggings USING btree (context);


--
-- TOC entry 3821 (class 1259 OID 20218)
-- Name: index_taggings_on_tag_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX index_taggings_on_tag_id ON public.taggings USING btree (tag_id);


--
-- TOC entry 3822 (class 1259 OID 20221)
-- Name: index_taggings_on_taggable_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX index_taggings_on_taggable_id ON public.taggings USING btree (taggable_id);


--
-- TOC entry 3823 (class 1259 OID 20219)
-- Name: index_taggings_on_taggable_id_and_taggable_type_and_context; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX index_taggings_on_taggable_id_and_taggable_type_and_context ON public.taggings USING btree (taggable_id, taggable_type, context);


--
-- TOC entry 3824 (class 1259 OID 20222)
-- Name: index_taggings_on_taggable_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX index_taggings_on_taggable_type ON public.taggings USING btree (taggable_type);


--
-- TOC entry 3825 (class 1259 OID 20224)
-- Name: index_taggings_on_tagger_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX index_taggings_on_tagger_id ON public.taggings USING btree (tagger_id);


--
-- TOC entry 3826 (class 1259 OID 20223)
-- Name: index_taggings_on_tagger_id_and_tagger_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX index_taggings_on_tagger_id_and_tagger_type ON public.taggings USING btree (tagger_id, tagger_type);


--
-- TOC entry 3831 (class 1259 OID 20235)
-- Name: index_tags_on_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX index_tags_on_name ON public.tags USING btree (name);


--
-- TOC entry 3834 (class 1259 OID 20244)
-- Name: index_team_members_on_team_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX index_team_members_on_team_id ON public.team_members USING btree (team_id);


--
-- TOC entry 3835 (class 1259 OID 20243)
-- Name: index_team_members_on_team_id_and_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX index_team_members_on_team_id_and_user_id ON public.team_members USING btree (team_id, user_id);


--
-- TOC entry 3836 (class 1259 OID 20245)
-- Name: index_team_members_on_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX index_team_members_on_user_id ON public.team_members USING btree (user_id);


--
-- TOC entry 3839 (class 1259 OID 20256)
-- Name: index_teams_on_account_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX index_teams_on_account_id ON public.teams USING btree (account_id);


--
-- TOC entry 3840 (class 1259 OID 20257)
-- Name: index_teams_on_name_and_account_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX index_teams_on_name_and_account_id ON public.teams USING btree (name, account_id);


--
-- TOC entry 3845 (class 1259 OID 20283)
-- Name: index_users_on_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX index_users_on_email ON public.users USING btree (email);


--
-- TOC entry 3846 (class 1259 OID 20284)
-- Name: index_users_on_pubsub_token; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX index_users_on_pubsub_token ON public.users USING btree (pubsub_token);


--
-- TOC entry 3847 (class 1259 OID 20285)
-- Name: index_users_on_reset_password_token; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX index_users_on_reset_password_token ON public.users USING btree (reset_password_token);


--
-- TOC entry 3848 (class 1259 OID 20286)
-- Name: index_users_on_uid_and_provider; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX index_users_on_uid_and_provider ON public.users USING btree (uid, provider);


--
-- TOC entry 3851 (class 1259 OID 20298)
-- Name: index_webhooks_on_account_id_and_url; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX index_webhooks_on_account_id_and_url ON public.webhooks USING btree (account_id, url);


--
-- TOC entry 3854 (class 1259 OID 20308)
-- Name: index_working_hours_on_account_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX index_working_hours_on_account_id ON public.working_hours USING btree (account_id);


--
-- TOC entry 3855 (class 1259 OID 20309)
-- Name: index_working_hours_on_inbox_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX index_working_hours_on_inbox_id ON public.working_hours USING btree (inbox_id);


--
-- TOC entry 3827 (class 1259 OID 20217)
-- Name: taggings_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX taggings_idx ON public.taggings USING btree (tag_id, taggable_id, taggable_type, context, tagger_id, tagger_type);


--
-- TOC entry 3828 (class 1259 OID 20220)
-- Name: taggings_idy; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX taggings_idy ON public.taggings USING btree (taggable_id, taggable_type, tagger_id, context);


--
-- TOC entry 3713 (class 1259 OID 19900)
-- Name: uniq_email_per_account_contact; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX uniq_email_per_account_contact ON public.contacts USING btree (email, account_id);


--
-- TOC entry 3714 (class 1259 OID 19901)
-- Name: uniq_identifier_per_account_contact; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX uniq_identifier_per_account_contact ON public.contacts USING btree (identifier, account_id);


--
-- TOC entry 3803 (class 1259 OID 20168)
-- Name: uniq_primary_actor_per_account_notifications; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX uniq_primary_actor_per_account_notifications ON public.notifications USING btree (primary_actor_type, primary_actor_id);


--
-- TOC entry 3804 (class 1259 OID 20169)
-- Name: uniq_secondary_actor_per_account_notifications; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX uniq_secondary_actor_per_account_notifications ON public.notifications USING btree (secondary_actor_type, secondary_actor_id);


--
-- TOC entry 3632 (class 1259 OID 19607)
-- Name: uniq_user_id_per_account_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX uniq_user_id_per_account_id ON public.account_users USING btree (account_id, user_id);


--
-- TOC entry 3809 (class 1259 OID 20181)
-- Name: unique_permissibles_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX unique_permissibles_index ON public.platform_app_permissibles USING btree (platform_app_id, permissible_id, permissible_type);


--
-- TOC entry 3888 (class 2620 OID 20441)
-- Name: accounts accounts_after_insert_row_tr; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER accounts_after_insert_row_tr AFTER INSERT ON public.accounts FOR EACH ROW EXECUTE FUNCTION public.accounts_after_insert_row_tr();


--
-- TOC entry 3889 (class 2620 OID 20445)
-- Name: accounts camp_dpid_before_insert; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER camp_dpid_before_insert AFTER INSERT ON public.accounts FOR EACH ROW EXECUTE FUNCTION public.camp_dpid_before_insert();


--
-- TOC entry 3890 (class 2620 OID 20447)
-- Name: campaigns campaigns_before_insert_row_tr; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER campaigns_before_insert_row_tr BEFORE INSERT ON public.campaigns FOR EACH ROW EXECUTE FUNCTION public.campaigns_before_insert_row_tr();


--
-- TOC entry 3891 (class 2620 OID 20443)
-- Name: conversations conversations_before_insert_row_tr; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER conversations_before_insert_row_tr BEFORE INSERT ON public.conversations FOR EACH ROW EXECUTE FUNCTION public.conversations_before_insert_row_tr();


--
-- TOC entry 3867 (class 2606 OID 20335)
-- Name: campaigns fk_rails_06c0f322c9; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.campaigns
    ADD CONSTRAINT fk_rails_06c0f322c9 FOREIGN KEY (account_id) REFERENCES public.accounts(id) ON DELETE CASCADE;


--
-- TOC entry 3883 (class 2606 OID 20415)
-- Name: notes fk_rails_0718ac16b7; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notes
    ADD CONSTRAINT fk_rails_0718ac16b7 FOREIGN KEY (contact_id) REFERENCES public.contacts(id) ON DELETE CASCADE;


--
-- TOC entry 3885 (class 2606 OID 20425)
-- Name: team_members fk_rails_194b5b076d; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.team_members
    ADD CONSTRAINT fk_rails_194b5b076d FOREIGN KEY (team_id) REFERENCES public.teams(id) ON DELETE CASCADE;


--
-- TOC entry 3881 (class 2606 OID 20405)
-- Name: mentions fk_rails_1b711e94aa; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mentions
    ADD CONSTRAINT fk_rails_1b711e94aa FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 3877 (class 2606 OID 20385)
-- Name: csat_survey_responses fk_rails_1fc902dbe1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.csat_survey_responses
    ADD CONSTRAINT fk_rails_1fc902dbe1 FOREIGN KEY (message_id) REFERENCES public.messages(id) ON DELETE CASCADE;


--
-- TOC entry 3870 (class 2606 OID 20350)
-- Name: contact_inboxes fk_rails_259aaf0cab; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contact_inboxes
    ADD CONSTRAINT fk_rails_259aaf0cab FOREIGN KEY (inbox_id) REFERENCES public.inboxes(id) ON DELETE CASCADE;


--
-- TOC entry 3880 (class 2606 OID 20400)
-- Name: mentions fk_rails_5cc4fd507c; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mentions
    ADD CONSTRAINT fk_rails_5cc4fd507c FOREIGN KEY (conversation_id) REFERENCES public.conversations(id) ON DELETE CASCADE;


--
-- TOC entry 3868 (class 2606 OID 20340)
-- Name: campaigns fk_rails_5fd93757fe; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.campaigns
    ADD CONSTRAINT fk_rails_5fd93757fe FOREIGN KEY (inbox_id) REFERENCES public.inboxes(id) ON DELETE CASCADE;


--
-- TOC entry 3872 (class 2606 OID 20360)
-- Name: conversations fk_rails_6122a36070; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conversations
    ADD CONSTRAINT fk_rails_6122a36070 FOREIGN KEY (contact_inbox_id) REFERENCES public.contact_inboxes(id) ON DELETE CASCADE;


--
-- TOC entry 3873 (class 2606 OID 20365)
-- Name: conversations fk_rails_64cfd1543f; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conversations
    ADD CONSTRAINT fk_rails_64cfd1543f FOREIGN KEY (team_id) REFERENCES public.teams(id) ON DELETE CASCADE;


--
-- TOC entry 3874 (class 2606 OID 20370)
-- Name: csat_survey_responses fk_rails_66432181af; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.csat_survey_responses
    ADD CONSTRAINT fk_rails_66432181af FOREIGN KEY (account_id) REFERENCES public.accounts(id) ON DELETE CASCADE;


--
-- TOC entry 3863 (class 2606 OID 20315)
-- Name: account_users fk_rails_685e030c15; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_users
    ADD CONSTRAINT fk_rails_685e030c15 FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 3866 (class 2606 OID 20330)
-- Name: agent_bots fk_rails_7a8c815834; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agent_bots
    ADD CONSTRAINT fk_rails_7a8c815834 FOREIGN KEY (account_id) REFERENCES public.accounts(id) ON DELETE CASCADE;


--
-- TOC entry 3884 (class 2606 OID 20420)
-- Name: notes fk_rails_7f2323ad43; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notes
    ADD CONSTRAINT fk_rails_7f2323ad43 FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 3875 (class 2606 OID 20375)
-- Name: csat_survey_responses fk_rails_80b30e3459; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.csat_survey_responses
    ADD CONSTRAINT fk_rails_80b30e3459 FOREIGN KEY (contact_id) REFERENCES public.contacts(id) ON DELETE CASCADE;


--
-- TOC entry 3876 (class 2606 OID 20380)
-- Name: csat_survey_responses fk_rails_826fc5e94b; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.csat_survey_responses
    ADD CONSTRAINT fk_rails_826fc5e94b FOREIGN KEY (conversation_id) REFERENCES public.conversations(id) ON DELETE CASCADE;


--
-- TOC entry 3878 (class 2606 OID 20390)
-- Name: csat_survey_responses fk_rails_969fa4c274; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.csat_survey_responses
    ADD CONSTRAINT fk_rails_969fa4c274 FOREIGN KEY (assigned_agent_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 3865 (class 2606 OID 20325)
-- Name: active_storage_variant_records fk_rails_993965df05; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.active_storage_variant_records
    ADD CONSTRAINT fk_rails_993965df05 FOREIGN KEY (blob_id) REFERENCES public.active_storage_blobs(id);


--
-- TOC entry 3886 (class 2606 OID 20430)
-- Name: team_members fk_rails_9ec2d5e75e; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.team_members
    ADD CONSTRAINT fk_rails_9ec2d5e75e FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 3887 (class 2606 OID 20435)
-- Name: teams fk_rails_b4ac0a83f9; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teams
    ADD CONSTRAINT fk_rails_b4ac0a83f9 FOREIGN KEY (account_id) REFERENCES public.accounts(id) ON DELETE CASCADE;


--
-- TOC entry 3864 (class 2606 OID 20320)
-- Name: active_storage_attachments fk_rails_c3b3935057; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.active_storage_attachments
    ADD CONSTRAINT fk_rails_c3b3935057 FOREIGN KEY (blob_id) REFERENCES public.active_storage_blobs(id);


--
-- TOC entry 3879 (class 2606 OID 20395)
-- Name: data_imports fk_rails_c6b651ee10; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.data_imports
    ADD CONSTRAINT fk_rails_c6b651ee10 FOREIGN KEY (account_id) REFERENCES public.accounts(id) ON DELETE CASCADE;


--
-- TOC entry 3871 (class 2606 OID 20355)
-- Name: conversations fk_rails_c80a0cac0d; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conversations
    ADD CONSTRAINT fk_rails_c80a0cac0d FOREIGN KEY (campaign_id) REFERENCES public.campaigns(id) ON DELETE CASCADE;


--
-- TOC entry 3862 (class 2606 OID 20310)
-- Name: account_users fk_rails_c96445f213; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_users
    ADD CONSTRAINT fk_rails_c96445f213 FOREIGN KEY (account_id) REFERENCES public.accounts(id) ON DELETE CASCADE;


--
-- TOC entry 3869 (class 2606 OID 20345)
-- Name: contact_inboxes fk_rails_ed53a99b1b; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contact_inboxes
    ADD CONSTRAINT fk_rails_ed53a99b1b FOREIGN KEY (contact_id) REFERENCES public.contacts(id) ON DELETE CASCADE;


--
-- TOC entry 3882 (class 2606 OID 20410)
-- Name: notes fk_rails_ed57cedfc1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notes
    ADD CONSTRAINT fk_rails_ed57cedfc1 FOREIGN KEY (account_id) REFERENCES public.accounts(id) ON DELETE CASCADE;


-- Completed on 2022-06-08 08:59:04 +07

--
-- PostgreSQL database dump complete
--

