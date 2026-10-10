const API_URL = "http://localhost:8080/api/users";

// 백엔드에서 받아올 회원 데이터의 형태 설정 interface
export interface User {
    userId: number;
    loginId: string;
    name: string;
    email: string | null;
    role: string;
    status: string;
    phone?: string | null;
}

// 회원 데이터 가져오기
export async function getUsers(): Promise<User[]> {
        // fetch API 를 사용하여 프론트엔드에서 백엔드로 요청을 보냄 
        //      -> 백엔드는 회원데이터를 JSON으로 돌려줌 / React는 데이터를 화면에 표시함
    const response = await fetch(API_URL);      
    if (!response.ok) {
        throw new Error("회원 정보를 불러오지 못했습니다. 다시 시도해주세요");
    }
    return response.json() as Promise<User[]>;
}