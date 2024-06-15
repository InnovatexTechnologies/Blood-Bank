import { useState, useEffect } from "react";
import axios from "axios";
import { axiosInstance } from "../../config";
import { FaBullseye } from "react-icons/fa";

const config = {
  headers: {
    Auth: localStorage.getItem("token"),
  },
};

const useGetApi = (initialUrl, initialData = null) => {

  const [url, setUrl] = useState(initialUrl);
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
 
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get(url, config);
        // 
        setData(response.data);
      } catch (error) {
        setError(error);
      }
      setIsLoading(false);
    };

    fetchData();
  }, [url]);



  const doFetch = async (newUrl) => {
    setUrl(newUrl);
    const response = await axiosInstance.get(url, config);
    setData(response.data);

  };

  return { data, isLoading, error, doFetch };

};

const usePostApi = (initialUrl, initialData = null) => {
  const [url, setUrl] = useState(initialUrl);
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const doPost = async (postData) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post(url, postData, config);
      
      setData(response.data);

    } catch (error) {
      
      alert(error.response.data.message)
      setError(error);
    }
    setIsLoading(false);
  };

  return { data, isLoading, error, doPost, setUrl };
};

const usePutApi = (initialUrl, initialData = null) => {
  const [url, setUrl] = useState(initialUrl);
  const [data, setData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const doPut = async (putData) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.put(url, putData, config);
      
      setData(response.data);

    } catch (error) {

      console.log("error in apicalls",error)

      alert(error.response.data.message)

      
      setError(error);
    }
    setIsLoading(false);
  };

  return { data, isLoading, error, doPut, setUrl };
};

const useDeleteApi = (initialUrl, initialData = null) => {
  const [url, setUrl] = useState(initialUrl);
  const [data, setData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const doDelete = async (newurl) => {
    const answer = window.confirm("Are You Sure ?");

    if (answer) {
      setIsLoading(true);
      try {
        const response = await axiosInstance.delete(newurl, config);
        setData(response.data);
      } catch (error) {
        alert(error.response.data.message)
        // 
        setError(error);
      }
      setIsLoading(false);
    }
  };

  return { data, isLoading, error, doDelete, setUrl };
};

export { useGetApi, usePostApi, usePutApi, useDeleteApi };
