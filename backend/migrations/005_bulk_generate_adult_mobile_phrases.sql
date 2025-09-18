-- 005_bulk_generate_adult_mobile_phrases.sql
USE linguaforge;

-- 目标：将“成人手机速用”分类扩充到总计500条

SET @target_total := 500;
SET @current_total := (SELECT COUNT(*) FROM words WHERE category = '成人手机速用');
SET @need := GREATEST(0, @target_total - @current_total);

-- 如果不需要补充，则直接结束
DO 0 = 0;

-- 仅当需要补充时执行生成
-- MariaDB 不支持 IF 直接控制整个脚本，这里通过 LIMIT 使用变量为0时不插入

-- 临时动词表（英文 + 中文）
CREATE TEMPORARY TABLE tmp_mobile_verbs (
  en VARCHAR(50),
  zh VARCHAR(50)
);

INSERT INTO tmp_mobile_verbs (en, zh) VALUES
('open','打开'),
('close','关闭'),
('enable','开启'),
('disable','关闭'),
('turn on','打开'),
('turn off','关闭'),
('increase','调高'),
('decrease','调低'),
('check','查看'),
('clear','清理'),
('update','更新'),
('install','安装'),
('uninstall','卸载'),
('connect','连接'),
('disconnect','断开'),
('share','分享'),
('search','搜索'),
('play','播放'),
('pause','暂停'),
('mute','静音'),
('unmute','取消静音'),
('backup','备份'),
('restore','还原'),
('lock','锁定'),
('unlock','解锁');

-- 临时名词表（英文 + 中文）
CREATE TEMPORARY TABLE tmp_mobile_nouns (
  en VARCHAR(80),
  zh VARCHAR(80)
);

INSERT INTO tmp_mobile_nouns (en, zh) VALUES
('wifi','Wi‑Fi'),
('bluetooth','蓝牙'),
('hotspot','热点'),
('flashlight','手电筒'),
('camera','相机'),
('gallery','相册'),
('ringtone','铃声'),
('volume','音量'),
('brightness','亮度'),
('notifications','通知'),
('cache','缓存'),
('app','应用'),
('browser','浏览器'),
('map','地图'),
('location','定位'),
('mobile data','移动数据'),
('contacts','联系人'),
('calendar','日历'),
('alarm','闹钟'),
('password','密码'),
('screen','屏幕'),
('vibration','振动'),
('airplane mode','飞行模式'),
('do not disturb','请勿打扰'),
('wallpaper','壁纸'),
('storage','存储'),
('battery saver','省电模式'),
('power','电源'),
('screen recorder','录屏'),
('screenshot','截图'),
('clipboard','剪贴板'),
('widget','小组件'),
('network','网络'),
('vpn','VPN'),
('email','邮件'),
('message','消息'),
('call forwarding','来电转接'),
('voicemail','语音信箱'),
('tethering','网络共享'),
('nfc','NFC'),
('qr code','二维码'),
('payment','支付'),
('wallet','电子钱包'),
('app store','应用商店'),
('permissions','权限'),
('privacy','隐私'),
('downloads','下载'),
('uploads','上传'),
('themes','主题'),
('gesture navigation','手势导航');

-- 基于动词 x 名词组合生成短语
INSERT INTO words (english, chinese, pronunciation, difficulty_level, category, story)
SELECT english, chinese, pronunciation, difficulty_level, category, story
FROM (
  SELECT
    CONCAT(v.en, ' ', n.en) AS english,
    CONCAT(v.zh, n.zh) AS chinese,
    NULL AS pronunciation,
    1 AS difficulty_level,
    '成人手机速用' AS category,
    CONCAT('他在手机上', v.zh, n.zh, '，处理得又快又好。') AS story,
    @row := @row + 1 AS rn
  FROM (SELECT @row := 0) AS _init,
       tmp_mobile_verbs v
       CROSS JOIN tmp_mobile_nouns n
       LEFT JOIN words w
         ON w.english = CONCAT(v.en, ' ', n.en) AND w.category = '成人手机速用'
  WHERE w.id IS NULL
) AS t
WHERE t.rn <= @need;

-- 清理临时表
DROP TEMPORARY TABLE IF EXISTS tmp_mobile_verbs;
DROP TEMPORARY TABLE IF EXISTS tmp_mobile_nouns;


