import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const bkURL = process.env.REACT_APP_BACK_URL;
// const NAVER_CLIENT_ID = process.env.REACT_APP_NAVER_CLIENT_ID;

const NaverLogin = () => {
    const NAVER_CLIENT_ID = process.env.REACT_APP_NAVER_CLIENT_ID; // 발급받은 클라이언트 아이디
    const REDIRECT_URI = "https://web-hotel-react-m6szyrxq03f42d77.sel4.cloudtype.app/oauth"; // Callback URL
    const STATE = "false";
    const NAVER_AUTH_URL = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${NAVER_CLIENT_ID}&state=${STATE}&redirect_uri=${REDIRECT_URI}`;
    
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);

    const handleNaverLogin = (e) => {
        e.preventDefault();
        window.location.href = `${bkURL}/naverLogin`// 네이버 로그인 백엔드 URL로 리디렉션
    };

    useEffect(() => {
        const naverLogin = new window.naver.LoginWithNaverId({
            clientId: "VQ2MBy9qmWgG6U7_jSOI", // 네이버에서 발급받은 클라이언트 아이디
            callbackUrl: "https://web-hotel-react-m6szyrxq03f42d77.sel4.cloudtype.app/nauth", // 리디렉션 URL (백엔드에서 받은 콜백 URL)
            isPopup: true, // 팝업 방식 여부
            loginButton: {
                color: "green", // 버튼 색상
                type: 3, // 버튼 형태 (기본, 텍스트 버튼 등)
                height: 44, // 버튼 높이
            },
        });

        naverLogin.init(); // 네이버 로그인 객체 초기화

        // 로그인 성공 여부를 확인하는 함수
        if (naverLogin.isLogin) {
            setIsLoggedIn(true);
            setUser(naverLogin.getProfile()); // 사용자 정보 가져오기
        }
    }, []);

    return (
        <div>
            {!isLoggedIn ? (
                    <div id="naverIdLogin" onClick={handleNaverLogin}></div>
            ) : (
                <div>
                    <p>{user?.name}님, 환영합니다!</p>
                </div>
            )}
        </div>
    );
};

export default NaverLogin;
