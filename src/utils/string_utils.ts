class StringUtils {
  // Bỏ dấu tiếng Việt
  public static removeVietnameseTones(str: string): string {
    str = str.toLowerCase();
    const from = 'àáãảạăằắẵẳặâầấẫẩậèéẽẻẹêềếễểệđìíĩỉịòóõỏọôồốỗổộơờớỡởợùúũủụưừứữửựỳýỹỷỵ';
    const to = 'aaaaaaaaaaaaaaaaaeeeeeeeeeeediiiiiooooooooooooooooouuuuuuuuuuuyyyyy';
    for (let i = 0, l = from.length; i < l; i++) {
      str = str.replace(RegExp(from.charAt(i), 'g'), to.charAt(i));
    }
    return str;
  }

  public static toSearchString(search: string): string {
    // URL decode
    search = decodeURIComponent(search);
    console.log(search);
    search = StringUtils.removeVietnameseTones(search)
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    search = search.replace(/\s+/g, ' | ').replace(/\b\w+\b/g, '$&:*');
    return search;
  }
}

export default StringUtils;