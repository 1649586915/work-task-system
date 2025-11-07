// -------------------------- 配置信息（必须修改！）--------------------------
const GITHUB_TOKEN = "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"; // 替换成你之前生成的令牌
const REPO_PATH = "1649586915/work-task-system"; // 替换成你的仓库路径
// --------------------------------------------------------------------------

// 保存数据到 GitHub Issues
async function saveDataToGitHub(data) {
  try {
    // 先检查是否已有标记为"settings"的issue
    const existingIssues = await fetch(
      `https://api.github.com/repos/${REPO_PATH}/issues?labels=settings`,
      {
        headers: {
          "Authorization": `token ${GITHUB_TOKEN}`,
          "Accept": "application/vnd.github.v3+json"
        }
      }
    ).then(res => res.json());

    if (existingIssues.length > 0) {
      // 已有则更新
      const issueId = existingIssues[0].number;
      await fetch(
        `https://api.github.com/repos/${REPO_PATH}/issues/${issueId}`,
        {
          method: "PATCH",
          headers: {
            "Authorization": `token ${GITHUB_TOKEN}`,
            "Content-Type": "application/json",
            "Accept": "application/vnd.github.v3+json"
          },
          body: JSON.stringify({ body: JSON.stringify(data) })
        }
      );
    } else {
      // 没有则创建新issue
      await fetch(
        `https://api.github.com/repos/${REPO_PATH}/issues`,
        {
          method: "POST",
          headers: {
            "Authorization": `token ${GITHUB_TOKEN}`,
            "Content-Type": "application/json",
            "Accept": "application/vnd.github.v3+json"
          },
          body: JSON.stringify({
            title: "User Data Storage",
            body: JSON.stringify(data),
            labels: ["settings"]
          })
        }
      );
    }
    console.log("数据保存成功");
  } catch (error) {
    console.error("保存失败：", error);
  }
}

// 从 GitHub Issues 读取数据
async function loadDataFromGitHub() {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${REPO_PATH}/issues?labels=settings`,
      {
        headers: {
          "Authorization": `token ${GITHUB_TOKEN}`,
          "Accept": "application/vnd.github.v3+json"
        }
      }
    );
    const issues = await response.json();

    // 有数据则解析，无数据返回默认值（可根据你的需求修改默认值）
    return issues.length > 0 ? JSON.parse(issues[0].body) : {
      darkMode: false, // 深色模式默认关闭
      tasks: [],       // 任务列表默认空
      otherSettings: {}// 其他设置默认空对象
    };
  } catch (error) {
    console.error("读取失败：", error);
    return { darkMode: false, tasks: [], otherSettings: {} }; // 失败时返回默认值
  }
}

// -------------------------- 全局变量（存储当前用户数据）--------------------------
let currentUserData = {}; // 用来存当前页面的用户数据，供其他JS调用

// 页面加载时初始化数据（读取GitHub上的保存数据）
window.onload = async () => {
  currentUserData = await loadDataFromGitHub(); // 读取数据并赋值给全局变量
  console.log("已加载保存的数据：", currentUserData);
  
  // 这里可以添加“数据应用到页面”的逻辑（根据你的页面需求修改）
  // 示例1：应用深色模式
  if (currentUserData.darkMode) {
    document.body.classList.add("dark");
  }
  // 示例2：应用任务列表（如果你的页面有任务列表，需配合你的渲染函数）
  // if (currentUserData.tasks && typeof renderTasks === "function") {
  //   renderTasks(currentUserData.tasks);
  // }

};
