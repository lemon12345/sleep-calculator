"use client";
import { Link as I18nLink } from "@/i18n/routing";
import { Stars } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import {
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
} from "framer-motion";
import { StarsIcon, Moon, Sun, ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState, useRef, useCallback } from "react";
import { FiArrowRight } from "react-icons/fi";

const COLORS_TOP = ["#13FFAA", "#1E67C6", "#CE84CF", "#DD335C"];

// 时间格式对象，与原始代码一致
interface TimeObject {
  hours: number;
  minutes: number;
  meridiem: string;
}

// 时间选择器选项接口
interface TimePickerOption {
  value: number | string;
  text: number | string;
}

// 时间选择器列组件
interface TimePickerColumnProps {
  value: number | string;
  onChange: (value: number | string) => void;
  options: TimePickerOption[];
  className?: string;
  extraClass?: string;
}

const TimePickerColumn: React.FC<TimePickerColumnProps> = ({ 
  value, 
  onChange, 
  options, 
  className = "",
  extraClass = ""
}) => {
  const [rotation, setRotation] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // 移除调试代码
  const isDragging = useRef(false);
  const startY = useRef(0);
  const startRotation = useRef(0);

  // 移除复杂的旋转逻辑，使用简化布局

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    startY.current = e.clientY;
    startRotation.current = rotation;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    isDragging.current = true;
    startY.current = e.touches[0].clientY;
    startRotation.current = rotation;
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current) return;
    
    const deltaY = e.clientY - startY.current;
    const itemHeight = 48; // 每个项目的实际高度
    const currentIndex = options.findIndex(option => option.value === value);
    
    // 根据拖拽距离计算新索引
    const draggedItems = Math.round(deltaY / itemHeight);
    let newIndex = currentIndex - draggedItems;
    
    // 确保索引在有效范围内
    while (newIndex < 0) newIndex += options.length;
    while (newIndex >= options.length) newIndex -= options.length;
    
    onChange(options[newIndex].value);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging.current) return;
    e.preventDefault();
    
    const deltaY = e.touches[0].clientY - startY.current;
    const itemHeight = 48; // 每个项目的实际高度
    const currentIndex = options.findIndex(option => option.value === value);
    
    // 根据拖拽距离计算新索引
    const draggedItems = Math.round(deltaY / itemHeight);
    let newIndex = currentIndex - draggedItems;
    
    // 确保索引在有效范围内
    while (newIndex < 0) newIndex += options.length;
    while (newIndex >= options.length) newIndex -= options.length;
    
    onChange(options[newIndex].value);
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
    document.removeEventListener('touchmove', handleTouchMove);
    document.removeEventListener('touchend', handleTouchEnd);
  };

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const currentIndex = options.findIndex(option => option.value === value);
    const delta = e.deltaY > 0 ? 1 : -1;
    let newIndex = currentIndex + delta;
    
    // 安全的循环索引计算
    while (newIndex < 0) newIndex += options.length;
    while (newIndex >= options.length) newIndex -= options.length;
    
    onChange(options[newIndex].value);
  }, [value, options, onChange]);

  // 使用useEffect添加原生wheel事件监听器
  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    element.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      element.removeEventListener('wheel', handleWheel);
    };
  }, [handleWheel]);

  return (
    <div 
      ref={containerRef}
      className={`relative h-full text-center overflow-hidden ${className}`}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      {/* 顶部渐变 */}
      <div className="absolute top-0 left-0 z-[1] w-full h-[30%] bg-gradient-to-b from-[rgba(15,21,56,0.85)] to-transparent"></div>
      
      {/* 底部渐变 */}
      <div className="absolute bottom-0 left-0 z-[1] w-full h-[30%] bg-gradient-to-t from-[rgba(15,21,56,0.85)] to-transparent"></div>

      {/* 高亮区域指示器 - 更明显的中间选择区 */}
      <div className="absolute top-1/2 left-0 w-full h-16 -mt-8 bg-[rgba(0,0,0,0.1)] border-t border-b border-[rgba(255,255,255,0.2)] pointer-events-none z-[5]"></div>

      {/* 简化的选项列表 */}
      <div 
        className={`absolute top-0 left-0 w-full h-full`}
      >
        {/* 正确的连续序列显示 */}
        {(() => {
          let currentIndex = options.findIndex(opt => opt.value === value);
          // 如果找不到当前值，默认使用第一个
          if (currentIndex === -1) currentIndex = 0;
          
          // 创建连续的7个项目序列：当前值的上下各3个
          return Array.from({ length: 7 }, (_, i) => {
            const relativePosition = i - 3; // -3, -2, -1, 0, 1, 2, 3
            let arrayIndex = currentIndex + relativePosition;
            
            // 安全的循环索引计算
            while (arrayIndex < 0) arrayIndex += options.length;
            while (arrayIndex >= options.length) arrayIndex -= options.length;
            
            const option = options[arrayIndex];
            if (!option) return null; // 额外的安全检查
            
            const distance = Math.abs(relativePosition);
            
            return (
              <div
                key={`${option.value}-${relativePosition}`}
                  className="absolute w-full h-16 flex items-center justify-center text-center select-none"
                style={{
                  top: `calc(50% + ${relativePosition * 64 - 32}px)`,
                  opacity: distance === 0 ? 1 : Math.max(0.4, 1 - distance * 0.12),
                  color: distance === 0 ? '#ffffff' : '#777777',
                  fontSize: distance === 0 ? '20px' : '16px',
                  fontWeight: distance === 0 ? '700' : '400',
                  lineHeight: '1',
                  textRendering: 'auto',
                  WebkitFontSmoothing: 'auto',
                  fontFamily: 'system-ui, sans-serif',
                  textShadow: distance === 0 ? '0 1px 2px rgba(0,0,0,0.8)' : 'none',
                  transition: 'opacity 0.2s ease-out, color 0.2s ease-out',
                  backgroundColor: distance === 0 ? 'rgba(255,255,255,0.05)' : 'transparent',
                  borderRadius: distance === 0 ? '4px' : '0px'
                }}
              >
                {(() => {
                  if (typeof option.text === 'number') {
                    // 根据列类型格式化
                    if (options.length === 60) {
                      // 分钟列 (0-59) - 补零
                      return option.text.toString().padStart(2, '0');
                    } else if (options.length === 12) {
                      // 小时列 (1-12) - 不补零
                      return String(option.text);
                    } else {
                      // 其他情况 - 按原值显示
                      return String(option.text);
                    }
                  }
                  return String(option.text || '');
                })()}
              </div>
            );
          }).filter(Boolean); // 过滤掉null值
        })()}
      </div>
    </div>
  );
};

// 睡眠计算相关函数 - 完全按照原始JavaScript逻辑实现
const formatTime = (time: TimeObject, addHours?: number): string => {
  let allMinutes = time.hours * 60 + time.minutes;
  let meridiem = time.meridiem;
  
  if (addHours) {
    allMinutes += addHours * 60;
  }
  
  // 处理跨日情况
  if (allMinutes < 0) {
    allMinutes = 720 + allMinutes; // 720分钟 = 12小时
    meridiem = meridiem === "AM" ? "PM" : "AM";
  } else if (allMinutes > 720) {
    allMinutes -= 720;
    meridiem = meridiem === "AM" ? "PM" : "AM";
  }
  
  let hours = Math.floor(allMinutes / 60);
  hours = hours === 0 ? 12 : hours;
  let minutes = allMinutes % 60;
  minutes = minutes >= 10 ? minutes : parseInt(`0${minutes}`);
  
  return `${hours}:${minutes} ${meridiem}`;
};

const getCurrentTime = (): TimeObject => {
  const time = new Date();
  let hours = time.getHours();
  const minutes = time.getMinutes();
  let meridiem = "AM";
  
  if (hours > 11) {
    hours -= 12;
    meridiem = "PM";
  }
  
  return {
    hours,
    minutes, 
    meridiem,
  };
};

// 计算睡眠时间 - 原始代码生成6个时间点
const calculateSleepTimes = (wakeTime: TimeObject): string[] => {
  const times = [];
  // 原始代码生成6个时间点，每个相距1.5小时，从(6-i)*-1.5-0.25计算
  for (let i = 0; i < 6; i++) {
    const addHours = (6 - i) * -1.5 - 0.25; // 负值表示减去时间，即推算睡觉时间
    times.push(formatTime(wakeTime, addHours));
  }
  return times;
};

// 计算起床时间 - 基于当前时间
const calculateWakeUpTimes = (): string[] => {
  const currentTime = getCurrentTime();
  const times = [];
  // 原始代码生成6个时间点，从当前时间增加(6-i)*1.5+0.25小时
  for (let i = 0; i < 6; i++) {
    const addHours = (6 - i) * 1.5 + 0.25; // 正值表示增加时间，即起床时间
    times.push(formatTime(currentTime, addHours));
  }
  return times;
};

export default function Hero() {
  const [showCalculator, setShowCalculator] = useState(false);
  const [calculationMode, setCalculationMode] = useState<'bedtime' | 'wakeup'>('bedtime');
  const [currentTime, setCurrentTime] = useState<TimeObject>({
    hours: 6,
    minutes: 30,
    meridiem: "AM"
  });

  // 移除调试代码
  const [calculatedTimes, setCalculatedTimes] = useState<string[]>([]);
  
  const t = useTranslations("SleepCalculator");

  const color = useMotionValue(COLORS_TOP[0]);

  useEffect(() => {
    animate(color, COLORS_TOP, {
      ease: "easeInOut",
      duration: 10,
      repeat: Infinity,
      repeatType: "mirror",
    });
  }, []);

  // 处理计算睡眠时间 - 完全按照原始JavaScript逻辑
  const handleCalculateBedtime = () => {
    const times = calculateSleepTimes(currentTime);
    setCalculatedTimes(times);
    setShowCalculator(true);
    setCalculationMode('bedtime');
  };

  // 处理计算起床时间
  const handleCalculateWakeUp = () => {
    const times = calculateWakeUpTimes();
    setCalculatedTimes(times);
    setShowCalculator(true);
    setCalculationMode('wakeup');
  };

  // 返回睡眠计算器
  const handleBackToCalculator = () => {
    setShowCalculator(false);
    setCalculatedTimes([]);
  };

  const backgroundImage = useMotionTemplate`radial-gradient(125% 125% at 50% 0%, #020617 50%, ${color})`;
  const border = useMotionTemplate`1px solid ${color}`;
  const boxShadow = useMotionTemplate`0px 4px 24px ${color}`;

  return (
    <motion.section
      style={{
        backgroundImage,
      }}
      className="relative grid place-content-center overflow-hidden bg-gray-950 px-4 py-16 md:py-28 2xl:py-40 text-gray-200"
    >
      <div className="relative z-10 flex flex-col items-center max-w-4xl mx-auto">
        <h1 className="max-w-4xl bg-gradient-to-br from-white to-gray-400 bg-clip-text text-center text-3xl font-medium leading-tight text-transparent sm:text-5xl sm:leading-tight md:text-7xl md:leading-tight">
          {t("hero.title")}
        </h1>
        
        <p className="mt-6 mb-12 max-w-3xl text-center text-base leading-relaxed md:text-lg md:leading-relaxed">
          {t("hero.description")}
        </p>

        {!showCalculator ? (
          // 主界面 - 完全按照原始HTML结构
          <div className="w-full space-y-8">
            <div className="text-center">
              <p className="text-xl md:text-2xl font-medium mb-6">{t("hero.wakeUpTimeQuestion")}</p>
              
              {/* 时间选择器 - 完全按照原始HTML实现 */}
              <div className="flex justify-center items-center mb-8">
                <div 
                  className="relative flex items-stretch justify-between w-full max-w-[350px] h-52 border border-[#B1A873] rounded-[13px] bg-[rgba(15,21,56,0.99)] overflow-hidden"
                  style={{ 
                    perspective: '2000px',
                    perspectiveOrigin: 'center center'
                  }}
                >
                  {/* 顶部和底部线条，中间的高亮区域 */}
                  <div className="absolute z-[2] top-1/2 left-0 -mt-6 h-12 w-full border-t border-b border-[#1C2248] pointer-events-none"></div>
                  
                  {/* 内部阴影效果 */}
                  <div className="absolute z-[2] top-0 left-0 right-0 bottom-0 pointer-events-none shadow-[inset_0px_5px_8px_-3px_rgba(3,6,23,0.3)]"></div>

                  {/* 小时选择器 */}
                  <TimePickerColumn
                    value={currentTime.hours}
                    onChange={(value) => setCurrentTime({...currentTime, hours: value as number})}
                    options={Array.from({length: 12}, (_, i) => ({value: i+1, text: i+1}))}
                    className="flex-1 mx-1"
                  />

                  {/* 分钟选择器 */}
                  <TimePickerColumn
                    value={currentTime.minutes}
                    onChange={(value) => setCurrentTime({...currentTime, minutes: value as number})}
                    options={Array.from({length: 60}, (_, i) => ({value: i, text: i}))}
                    className="flex-1 mx-1"
                  />

                  {/* AM/PM选择器 */}
                  <TimePickerColumn
                    value={currentTime.meridiem}
                    onChange={(value) => setCurrentTime({...currentTime, meridiem: value as string})}
                    options={[{value: "AM", text: "AM"}, {value: "PM", text: "PM"}]}
                    className="flex-1 mx-1"
                  />
                </div>
              </div>


              <motion.button
                style={{
                  border,
                  boxShadow,
                }}
                whileHover={{
                  scale: 1.015,
                }}
                whileTap={{
                  scale: 0.985,
                }}
                onClick={handleCalculateBedtime}
                className="group relative w-fit rounded-full bg-gray-950/10 px-6 py-3 text-gray-50 transition-colors hover:bg-gray-950/50 mx-auto"
              >
                  <div className="flex items-center gap-2">
                    <Moon className="w-5 h-5" />
                    {t("hero.calculateBedtime")}
                  </div>
              </motion.button>
            </div>

            <div className="text-center">
              <p className="text-xl md:text-2xl font-medium mb-6">{t("hero.bedTimeQuestion")}</p>
              
              <motion.button
                style={{
                  border,
                  boxShadow,
                }}
                whileHover={{
                  scale: 1.015,
                }}
                whileTap={{
                  scale: 0.985,
                }}
                onClick={handleCalculateWakeUp}
                className="group relative w-fit rounded-full bg-gray-950/10 px-6 py-3 text-gray-50 transition-colors hover:bg-gray-950/50 mx-auto"
              >
                <div className="flex items-center gap-2">
                  <Sun className="w-5 h-5" />
                  {t("hero.calculateWakeUp")}
                </div>
              </motion.button>
            </div>
          </div>
        ) : (
          // 结果显示界面 - 完全按照原始HTML结构
          <div className="w-full space-y-6">
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                {calculationMode === 'bedtime' ? t("hero.bedtimeTitle") : t("hero.wakeupTitle")}
              </h2>
              <p className="text-base md:text-lg mb-2">{t("hero.fallAsleepTime")}</p>
              
              <p className="text-base md:text-lg mb-6">
                {calculationMode === 'bedtime' 
                  ? t("hero.bedtimeResult", { time: formatTime(currentTime) })
                  : t("hero.wakeupResult")
                }
              </p>
            </div>

            {/* 计算结果显示 - 原始代码前两个时间标记为建议时间 */}
            <div className="space-y-3 max-w-md mx-auto">
              {calculatedTimes.map((timeStr: string, index: number) => (
                <div
                  key={index}
                  className={`bg-gray-800/50 border border-gray-600 rounded-lg px-6 py-4 text-center ${
                    index < 2 ? 'border-yellow-200 bg-yellow-900/20' : ''
                  }`}
                >
                  <div className="text-lg font-semibold text-white">
                    {timeStr}
                  </div>
                  {index < 2 && (
                    <div className="text-sm text-yellow-300 mt-1">
                      {t("hero.suggestedTimes")}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <p className="text-center text-sm text-gray-400 max-w-2xl mx-auto">
              {t("hero.explanation")}
            </p>

            <div className="text-center">
              <motion.button
                style={{
                  border,
                  boxShadow,
                }}
                whileHover={{
                  scale: 1.015,
                }}
                whileTap={{
                  scale: 0.985,
                }}
                onClick={handleBackToCalculator}
                className="group relative w-fit rounded-full bg-gray-950/10 px-6 py-3 text-gray-50 transition-colors hover:bg-gray-950/50 mx-auto"
              >
                <div className="flex items-center gap-2">
                  <ArrowLeft className="w-5 h-5" />
                  {t("hero.goBack")}
                </div>
              </motion.button>
            </div>
          </div>
        )}
      </div>

      <div className="absolute inset-0 z-0">
        <Canvas>
          <Stars radius={50} count={2500} factor={4} fade speed={2} />
        </Canvas>
      </div>
    </motion.section>
  );
}
