import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../auth/components/authLayout";
import AccountFields from "./components/accountFields";
import ChoiceGroup from "./components/choiceGroup";
import FormField from "../auth/components/formField";
import { FormActions, SectionHeading, SignupTop, SuccessNotice } from "./components/signupParts";

const initialForm = { 
  name: "", 
  nickname: "", 
  birth: "", 
  gender: "", 
  nationality: "", 
  username: "", 
  password: "", 
  confirmPassword: "" 
};

// 검증 함수
type FormErrors = Partial<Record<keyof typeof initialForm, string>>;

const validateField = (
  field: keyof typeof initialForm,
  value: string,
  form: typeof initialForm
): string => {
  switch (field) {
    case "name":
      if (!value.trim()) return " 이름을 입력해주세요.";
      if (!/^[가-힣a-zA-Z]+$/.test(value)) {
        return "이름은 한글 또는 영문만 입력할 수 있습니다.";
      }
      return "";
    case "nickname":
      if(!value.trim()) return "닉네임을 입력해주세요.";
      if(value.length < 2 || value.length > 50){
        return " 닉네임은 2~50자로 입력해주세요.";
      }
      return "";
    case "birth": {
      const digits = value.replace(/\D/g, "");
      if (!digits) return "생년월일을 입력해주세요.";
      if (digits.length !== 8) {
        return "생년월일 8자리를 입력해주세요. (예: 19900101)";
    }
    const year = Number(digits.slice(0, 4));
    const month = Number(digits.slice(4, 6));
    const day = Number(digits.slice(6, 8));
    const date = new Date(year, month - 1, day);
    if (
      year < 1900 || date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day
    ) {
      return " 실제 존재하는 생년월일을 입력해주세요. "
    }
    if (date > new Date()) {
      return " 미래 날짜는 입력할 수 없습니다.";
    }
    return "";
  }
  case "gender":
    return value ? "" : "성별을 선택해주세요.";
  case "nationality":
    return value ? "" : "국적을 선택해주세요.";
  case "username":
    if (!value.trim()) return "아이디를 입력해주세요.";
    if (!/^[a-zA-Z0-9]{4,20}$/.test(value)) {
      return "아이디는 영문과 숫자로 4~20자 입력해주세요.";
    }
    return "";
  case "password":
    if (!value) return "비밀번호를 입력해주세요.";
    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,12}$/.test(value)) {
      return "비밀번호는 영문과 숫자를 포함해 8~12자로 입력해주세요.";
    }
    return "";
  case "confirmPassword":
    if (!value) return "비밀번호를 한 번 더 입력해주세요.";
    if (value !== form.password) {
      return "비밀번호가 일치하지 않습니다.";
    }
    return "";
    default:
      return "";
  }
};

export default function PersonalSignup() {
  const navigate = useNavigate(); 
  const [form, setForm] = useState(initialForm); 
  const [completed, setCompleted] = useState(false); 
  const [errors, setErrors] = useState<FormErrors>({});

  // 입력한 값이 변경될 때마다 form 상태 업데이트하는 함수
const update = (
  field: keyof typeof initialForm,
  value: string
) => {
  const nextForm = {
    ...form,
    [field]: value,
  };

  setForm(nextForm);

  // 입력 중인 항목의 오류를 바로 다시 검사
  setErrors((current) => ({
    ...current,
    [field]: validateField(field, value, nextForm),
    ...(field === "password" && nextForm.confirmPassword
      ? {
          confirmPassword: validateField(
            "confirmPassword",
            nextForm.confirmPassword,
            nextForm
          ),
        }
      : {}),
  }));
};
  // 생년월일 형식 변환 함수
  const formatBirth = (value: string) => {
    const numbers = value.replace(/\D/g, "").slice(0, 8);
    return [
      numbers.slice(0, 4), 
      numbers.slice(4, 6), 
      numbers.slice(6, 8)
    ].filter(Boolean)
    .join(".");
  };
  // 생년월일을 yyyy-mm-dd 형식으로 변환하는 함수
  const birthDate = form.birth.replace(/\./g, "-");

  // form 제출(회원가입 버튼 클릭) 시 호출되는 함수
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const fields = Object.keys(initialForm) as Array<
      keyof typeof initialForm
    >;
    const nextErrors: FormErrors = {};
    fields.forEach((field) => {
      const message = validateField(field, form[field], form);
      if (message) {
        nextErrors[field] = message;
      }
    });
    setErrors(nextErrors);
    if(Object.keys(nextErrors).length > 0) {
      return;
    }
    // 백엔드로 Data 전송
    const requestBody = {
      loginId: form.username,
      password: form.password,
      name: form.name,
      nickname: form.nickname,
      birthDate,
      email: null, // 이메일은 선택사항이므로 null로 설정
      phone: null, // 전화번호는 선택사항이므로 null로 설정
      gender: form.gender === "남성" ? "M" : "F",
      nationality: form.nationality === "내국인" ? "DOMESTIC" : "FOREIGN"
    };
    try {
      const response = await fetch(
        "http://localhost:8080/api/users/signup/personal",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );
      if(!response.ok) {
        const message = await response.text();
        throw new Error(
          message ||`회원가입 실패(${response.status})`
        );
      }
      
      const userId = await response.json();
      // 서버 저장이 성공한 경우에만 완료 표시하기
      setCompleted(true);
      alert(`회원가입 성공! 사용자 아아디: ${userId}`);
      navigate("/login");
    } catch(error){
      console.error("회원가입 오류:",error);
      alert(
        error instanceof Error
        ? error.message
        : "회원가입 중 오류가 발생했습니다. 잠시후 다시 시도해주세요."
      );
    };
  } 

  return (
    <AuthLayout wide title="당신의 새로운 커리어를 시작하세요">
      <SignupTop title="일반회원 가입" subtitle="채용정보와 커뮤니티를 이용할 개인 정보를 입력해주세요." onBack={() => navigate("/signup")} />
      <form className="auth-form signup-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <SectionHeading number="01" title="기본 정보" description="본인 확인과 커뮤니티 활동에 사용됩니다." />
          <div className="form-grid">
            <FormField label="이름" name="name" value={form.name} onChange={(value) => update("name", value.replace(/[\s~!@#$%^&*()_+={}[\]|\\:;"'<>,?/]/g, ""))}
              placeholder="이름을 입력해주세요    예) 홍길동" required hint="  특수기호와 공백은 사용할 수 없습니다." />
            <FormField label="닉네임" name="nickname" value={form.nickname} onChange={(value) => update("nickname", value)}
              placeholder="커뮤니티에서 사용할 이름" required />
            <FormField label="생년월일" name="birth" value={form.birth} onChange={(value) => update("birth", formatBirth(value))}
              placeholder="1999.01.01" required maxLength={10} hint="8자리 숫자로 입력해주세요." />
          </div>
          <div className="form-grid">
            <ChoiceGroup label="성별" options={["남성", "여성"]} value={form.gender} onChange={(value) => update("gender", value)} />
            <ChoiceGroup label="국적" options={["내국인", "외국인"]} value={form.nationality} onChange={(value) => update("nationality", value)} />
          </div>
        </div>
        <AccountFields username={form.username} password={form.password} confirmPassword={form.confirmPassword}
          onChange={(field, value) => update(field, value)} />
        {completed && <SuccessNotice />}
        <FormActions onBack={() => navigate("/signup")} label="일반회원으로 가입하기" />
      </form>
    </AuthLayout>
  );
}
