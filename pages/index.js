import {useCallback, useState} from 'react';
import Head from 'next/head';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import * as UrlParser from 'url-parse';
import * as qs from 'qs';
import JSONPretty from 'react-json-pretty';
// import 'react-json-pretty/themes/monikai.css';

const validationSchema = yup.object().shape({
  url: yup.string()
    // .url('Must be a valid URL')
    .required(''),
});

// const defaultValues =  {url: "https://dev-dy9053eu.eu.auth0.com/login?state=hKFo2SBzUFdHbmFua0pfUVRXeF9ZNk51NE1wUU80d2E2SmZiWqFupWxvZ2luo3RpZNkgaloxOEZXZllwdThGX3N1OEFLdUVCRWlYbkM1elFkRjGjY2lk2SBMVVAwelB6MUt3QTNzYXhsMThaTFZNV2YzSk5xbkhIWg&client=LUP0zPz1KwA3saxl18ZLVMWf3JNqnHHZ&protocol=oauth2&scope=openid%20profile%20email%20offline_access&response_type=code&redirect_uri=https%3A%2F%2Fstaging.rario.com%2Fapi%2Fauth%2Fcallback&audience=https%3A%2F%2Frario.backend.module&mode=signUp&nonce=Xd4IBQOprUFV656Gfun9MGes05Py4dCnf3rZQw69DKs&code_challenge=BnKTa9qUEmUAUQxhHqV4HcM5yCAcjbhZbDGJledMwSM&code_challenge_method=S256&_search[satish]=somevalue#asdf"}
const defaultValues =  {}
export default function Home() {
  const [data, setData] = useState();
  const { register, handleSubmit, watch, formState: { errors, isValid } } = useForm({
    reValidateMode: 'onChange',
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
    defaultValues
  });

  const onSubmit = useCallback((values) => {
    const urlParser = new UrlParser(values.url);
    const query = qs.parse(urlParser.query, {ignoreQueryPrefix: true});
    const urlPath = `${urlParser.origin}${urlParser.pathname}`;
    const hash = urlParser.hash;
    const username = urlParser.username;
    const password = urlParser.password;
    setData({
      query, urlPath, hash, username, password,
    });
  }, []);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 text-center bg-gradient-to-r from-purple-50 to-purple-100">
      <Head>
        <title>Simple URL Formatter</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center w-full flex-1 px-20">
        {
          !data && (
            <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col justify-center justify-items-center items-center">
              <textarea
                {...register('url', {required: true})}
                className={`focus:outline-none focus:ring focus:shadow-xl p-3 w-full ${errors['url'] ? 'focus:ring-red-200' : 'focus:ring-purple-200'}`} rows="6" placeholder="https://example.com"></textarea>
              
              <span className="text-red-600 mt-2 absolute top-14">{errors['url']?.message}</span>

              <button
                disabled={!isValid}
                className="p-3 text-white bg-purple-500 hover:bg-purple-600 ring-4 hover:shadow-xl ring-purple-300 rounded-sm mt-9 max-w-xs" type="submit">Pretty Print URL</button>
            </form>
          )
        }

        {
          data && (
            <div className="text-left mx-3">
              <div className="text-purple-900 bg-purple-200  shadow-lg mb-5 p-3 overflow-scroll">{data.urlPath}</div>
              {data.username && <div className="text-purple-700  shadow-lg bg-purple-200 mb-5 p-3 overflow-scroll">Username: <span className="text-purple-900">{data.username}</span></div>}
              {data.password && <div className="text-purple-700 shadow-lg bg-purple-200 mb-5 p-3 overflow-scroll">Password: <span className="text-purple-900">{data.password}</span></div>}
              {data.hash && <div className="text-purple-700 shadow-lg bg-purple-200 mb-5 p-3 overflow-scroll">Hash: <span className="text-purple-900">{data.hash}</span></div>}

              <div className="shadow-lg">
                {!!Reflect.ownKeys(data.query).length && <JSONPretty id="json-pretty" className="max-w-5xl" data={data.query} />}
                {!!Reflect.ownKeys(data.query).length && <div id="query" className="max-w-5xl bg-gray-500  text-white p-2">Query</div>}
              </div>
              
            </div>
          )
        }

        {data && <button type="buttn" className="p-3 text-white hover:bg-purple-600 hover:shadow-xl shadow-lg bg-purple-500 ring-4 ring-purple-300 rounded-sm mt-9 max-w-xs"
          
          onClick={() => {
            setData(null);
          }}> Pretify new URL</button>}
        
      </main>
    </div>
  )
}
