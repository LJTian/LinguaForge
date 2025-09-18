-- 006_fill_pronunciation_for_generated_mobile_phrases.sql
USE linguaforge;

-- 为 005 自动生成的“动词+名词”短语补充基础 IPA 音标
-- 说明：音标为常见读音的简化组合，用于学习辅助，非严格学术标注

CREATE TEMPORARY TABLE tmp_mobile_verbs_ipa (
  en VARCHAR(50),
  zh VARCHAR(50),
  ipa VARCHAR(64)
);

INSERT INTO tmp_mobile_verbs_ipa (en, zh, ipa) VALUES
('open','打开','ˈoʊpən'),
('close','关闭','kloʊz'),
('enable','开启','ɪˈneɪbəl'),
('disable','关闭','dɪsˈeɪbəl'),
('turn on','打开','tɜːrn ɑːn'),
('turn off','关闭','tɜːrn ɔːf'),
('increase','调高','ɪnˈkriːs'),
('decrease','调低','dɪˈkriːs'),
('check','查看','tʃek'),
('clear','清理','klɪr'),
('update','更新','ˈʌpdeɪt'),
('install','安装','ɪnˈstɔːl'),
('uninstall','卸载','ˌʌnɪnˈstɔːl'),
('connect','连接','kəˈnekt'),
('disconnect','断开','ˌdɪskəˈnekt'),
('share','分享','ʃer'),
('search','搜索','sɜːrtʃ'),
('play','播放','pleɪ'),
('pause','暂停','pɔːz'),
('mute','静音','mjuːt'),
('unmute','取消静音','ʌnˈmjuːt'),
('backup','备份','ˈbækʌp'),
('restore','还原','rɪˈstɔːr'),
('lock','锁定','lɑːk'),
('unlock','解锁','ʌnˈlɑːk');

CREATE TEMPORARY TABLE tmp_mobile_nouns_ipa (
  en VARCHAR(80),
  zh VARCHAR(80),
  ipa VARCHAR(96)
);

INSERT INTO tmp_mobile_nouns_ipa (en, zh, ipa) VALUES
('wifi','Wi‑Fi','ˈwaɪfaɪ'),
('bluetooth','蓝牙','ˈbluːtuːθ'),
('hotspot','热点','ˈhɒtspɒt'),
('flashlight','手电筒','ˈflæʃlaɪt'),
('camera','相机','ˈkæmərə'),
('gallery','相册','ˈɡæləri'),
('ringtone','铃声','ˈrɪŋtoʊn'),
('volume','音量','ˈvɒljuːm'),
('brightness','亮度','ˈbraɪtnəs'),
('notifications','通知','ˌnoʊtɪfɪˈkeɪʃənz'),
('cache','缓存','kæʃ'),
('app','应用','æp'),
('browser','浏览器','ˈbraʊzər'),
('map','地图','mæp'),
('location','定位','loʊˈkeɪʃn'),
('mobile data','移动数据','ˈmoʊbəl ˈdeɪtə'),
('contacts','联系人','ˈkɒntækts'),
('calendar','日历','ˈkælɪndər'),
('alarm','闹钟','əˈlɑːrm'),
('password','密码','ˈpæswɜːrd'),
('screen','屏幕','skriːn'),
('vibration','振动','vaɪˈbreɪʃn'),
('airplane mode','飞行模式','ˈerpleɪn moʊd'),
('do not disturb','请勿打扰','ˌduː nɒt dɪˈstɜːrb'),
('wallpaper','壁纸','ˈwɔːlˌpeɪpər'),
('storage','存储','ˈstɔːrɪdʒ'),
('battery saver','省电模式','ˈbætəri ˈseɪvər'),
('power','电源','ˈpaʊər'),
('screen recorder','录屏','skriːn rɪˈkɔːrdər'),
('screenshot','截图','ˈskriːnʃɒt'),
('clipboard','剪贴板','ˈklɪpbɔːrd'),
('widget','小组件','ˈwɪdʒɪt'),
('network','网络','ˈnetwɜːrk'),
('vpn','VPN','ˌviː piː ˈen'),
('email','邮件','ˈiːmeɪl'),
('message','消息','ˈmesɪdʒ'),
('call forwarding','来电转接','kɔːl ˈfɔːrwərdɪŋ'),
('voicemail','语音信箱','ˈvɔɪsmeɪl'),
('tethering','网络共享','ˈteðərɪŋ'),
('nfc','NFC','ˌen ef ˈsiː'),
('qr code','二维码','ˌkjuː ˈɑːr koʊd'),
('payment','支付','ˈpeɪmənt'),
('wallet','电子钱包','ˈwɒlɪt'),
('app store','应用商店','æp stɔːr'),
('permissions','权限','pərˈmɪʃənz'),
('privacy','隐私','ˈpraɪvəsi'),
('downloads','下载','ˈdaʊnloʊdz'),
('uploads','上传','ˈʌploʊdz'),
('themes','主题','θiːmz'),
('gesture navigation','手势导航','ˈdʒestʃər ˌnævɪˈɡeɪʃn');

-- 更新已有记录（仅填充空音标）
UPDATE words w
JOIN tmp_mobile_verbs_ipa v
JOIN tmp_mobile_nouns_ipa n
  ON w.english = CONCAT(v.en, ' ', n.en)
SET w.pronunciation = CONCAT('/', TRIM(CONCAT(v.ipa, ' ', n.ipa)), '/')
WHERE w.category = '成人手机速用' AND (w.pronunciation IS NULL OR w.pronunciation = '');

DROP TEMPORARY TABLE IF EXISTS tmp_mobile_verbs_ipa;
DROP TEMPORARY TABLE IF EXISTS tmp_mobile_nouns_ipa;


