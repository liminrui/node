function genUserData(count) {
  // 97-122
  //1.名称在三个字符内
  let data = [];

  for (let c = 0; c < count; c++) {
    const strLen = 1 + parseInt(Math.random() * 3);

    let name = "";
    for (let i = 0; i < strLen; i++) {
      let charCode = 97 + parseInt(Math.random() * (122 - 97));
      name += String.fromCharCode(charCode);
    }

    const pwd = parseInt(Math.random() * 1000000);

    data.push({
      username: name,
      password: pwd,
    });
  }

  return data;
}

// genUserData(3);

module.exports = genUserData;
