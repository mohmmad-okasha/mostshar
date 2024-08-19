import { Menu, MenuProps } from "antd";
import Sider from "antd/es/layout/Sider";
import React, { useEffect, useState } from "react";
import { PieChartOutlined, UserOutlined } from "@ant-design/icons";
import { FaRegEye } from "react-icons/fa6";
import { LiaHotelSolid } from "react-icons/lia";
import { TbHotelService } from "react-icons/tb";
import { FaCalendarAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useCookies } from "react-cookie";
import Image from "next/image";
import logo from "@/public/logo.png"; // Adjust the path if needed
import { getRules } from "@/app/shared";

type MenuItem = Required<MenuProps>["items"][number];

export default function App() {
  const [loading, setLoading] = useState(true);
  const [cookies, setCookies] = useCookies(["token", "loading"]);

  useEffect(() => {
    if (cookies.loading === true) setLoading(true);
    else setLoading(false);
  }, [cookies.loading]);

  const router = useRouter();
  const [rules, setRules] = useState<any>([]);
  //const [_, setCookies] = useCookies(["loading"]); //for loading page
  const userName = window.localStorage.getItem("userName");

  const items: MenuItem[] = [
    {
      key: "1",
      icon: <PieChartOutlined />,
      label: "Dashboard",
      onClick: () => {
        router.push("/dashboard");
      },
    },
    {
      key: "2",
      icon: <UserOutlined />,
      label: "Users",
      onClick: () => {
        setCookies("loading", true);
        router.push("/users");
      },
      disabled: rules["Users"] == 0,
    },
    {
      key: "3",
      icon: <LiaHotelSolid />,
      label: "Hotels",
      onClick: () => {
        setCookies("loading", true);
        router.push("/hotels");
      },
      disabled: rules["Hotels"] == 0,
    },
    {
      key: "4",
      icon: <FaRegEye />,
      label: "Logs",
      onClick: () => {
        router.push("/logs");
        setCookies("loading", true);
      },
      disabled: rules["Logs"] == 0,
    },
    {
      key: "5",
      icon: <FaCalendarAlt />,
      label: "Booking",
      onClick: () => {
        router.push("/bookings");
        setCookies("loading", true);
      },
      disabled: rules["Booking"] == 0,
    },
    {
      key: "6",
      icon: <TbHotelService />,
      label: "Available Hotels",
      onClick: () => {
        router.push("/availableHotels");
        setCookies("loading", true);
      },
      disabled: rules["Available Hotels"] == 0,
    },
    // {
    //   key: "sub1",
    //   label: "Navigation One",
    //   icon: <MailOutlined />,
    //   children: [
    //     { key: "10", label: "Option 5" },
    //     { key: "11", label: "Option 6" },
    //     { key: "12", label: "Option 7" },
    //     { key: "13", label: "Option 8" },
    //   ],
    // },
    // {
    //   key: "sub2",
    //   label: "Navigation Two",
    //   icon: <AppstoreOutlined />,
    //   children: [
    //     { key: "14", label: "Option 9" },
    //     { key: "15", label: "Option 10" },
    //     {
    //       key: "sub3",
    //       label: "Submenu",
    //       children: [
    //         { key: "16", label: "Option 11" },
    //         { key: "17", label: "Option 12" },
    //       ],
    //     },
    //   ],
    // },
  ];

  //collaps or not on button click
  const [collaps, setCollaps] = useState(false);
  const changeCollaps = () => {
    setCollaps(!collaps);
  };

  useEffect(() => {
    //to get user rules
    getRules(userName).then((value) => {
      setRules(value);
    });
  }, []);

  return (
    <>
      <Sider
        breakpoint='lg'
        collapsedWidth='0'
        collapsed={collaps}
        onCollapse={changeCollaps}
        style={{ position: "sticky", top: 0, zIndex: 1, width: "80vh" }}>
        <div style={{ padding: 20, textAlign: "center" }}>
          <Image src={logo} alt='' width={60} height={60} />
        </div>

        <Menu
          disabled={loading}
          theme='dark'
          style={{ backgroundColor: "#098290" }}
          defaultSelectedKeys={["1"]}
          mode='inline'
          items={items}
        />
      </Sider>
    </>
  );
}
