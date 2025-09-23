import React, { useContext, useState, useEffect } from 'react';
import { UsergroupAddOutlined, HomeOutlined, SettingOutlined, BookOutlined } from '@ant-design/icons';
import { Menu, Badge } from 'antd';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/auth.context';
import { getFavoriteLessonApi } from '../../util/api';


const Header = () => {
    const navigate = useNavigate();
    const location = useLocation(); // 🔹 thêm useLocation
    const { auth, setAuth } = useContext(AuthContext);
    
    const [current, setCurrent] = useState('home');
    const [savedLessonsCount, setSavedLessonsCount] = useState();

    // 1️⃣ Load auth từ localStorage
    useEffect(() => {
        const id = localStorage.getItem("id") || "";
        const name = localStorage.getItem("name") || "";
        const email = localStorage.getItem("email") || "";
    
        if (id) {
        setAuth({
            isAuthenticated: true,
            user: { id, name, email }
        });
        }
    }, [setAuth]);
    
    // 2️⃣ Lấy số bài học đã lưu khi auth được cập nhật
    useEffect(() => {
        const fetchSavedCount = async () => {
        if (!auth.isAuthenticated) return;
    
        try {
            const res = await getFavoriteLessonApi(auth.user.id);
            setSavedLessonsCount(res.total || 0);
        } catch (err) {
            console.error("Không thể tải số bài học đã lưu", err);
        }
        };
    
        fetchSavedCount();
    }, [auth.isAuthenticated, auth.user?.id]);

    // 🔹 Sync current menu với pathname
    useEffect(() => {
        if (location.pathname.startsWith('/users/') && location.pathname.includes('/favorites')) {
            setCurrent('saved');
        } else if (location.pathname === '/') {
            setCurrent('home');
        } else if (location.pathname.startsWith('/user')) {
            setCurrent('user');
        } else if (location.pathname.startsWith('/profile')) {
            setCurrent('profile');
        } else if (location.pathname.startsWith('/orders')) {
            setCurrent('orders');
        }
    }, [location.pathname]);

    const items = [
        {
            label: <Link to={"/"}>Home Page</Link>,
            key: 'home',
            icon: <HomeOutlined />,
        },
        ...(auth.isAuthenticated ? [
            {
                label: <Link to={"/user"}>Users</Link>,
                key: 'user',
                icon: <UsergroupAddOutlined />,
            },
            {
              label: (
                  <Badge count={savedLessonsCount} overflowCount={99}>
                      <Link to={`/users/${auth?.user?.id}/favorites`} style={{ textDecoration: 'none', color: 'inherit' }}>
                          Bài học đã lưu
                      </Link>
                  </Badge>
              ),
              key: 'saved',
              icon: <BookOutlined />,
              style: { marginLeft: 'auto' },
            }
        ] : []),
        {
            label: `Welcome ${auth?.user?.name ?? ""}`,
            key: 'SubMenu',
            icon: <SettingOutlined />,
            children: auth.isAuthenticated
              ? [
                  { label: <Link to="/profile" style={{ textDecoration: 'none', color: 'inherit' }}>Hồ sơ</Link>, key: 'profile' },
                  { label: <Link to="/orders" style={{ textDecoration: 'none', color: 'inherit' }}>Đơn hàng của tôi</Link>, key: 'orders' },
                  { 
                    label: (
                      <span
                        onClick={() => {
                          localStorage.removeItem("access_token");
                          setCurrent("home");
                          setAuth({ isAuthenticated: false, user: { id: "", email: "", name: "" } });
                          navigate("/");
                        }}
                        style={{ cursor: 'pointer' }}
                      >
                        Đăng xuất
                      </span>
                    ), 
                    key: 'logout' 
                  },
                ]
              : [
                  { label: <Link to="/login">Đăng nhập</Link>, key: 'login' },
                ],
        },
    ];

    const onclick = (e) => setCurrent(e.key);

    return (
        <Menu 
            onClick={onclick} 
            selectedKeys={[current]} 
            mode="horizontal" 
            items={items} 
        />
    );
};

export default Header;