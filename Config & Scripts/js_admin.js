// [كود محسن لعرض البيانات]
async function fetchItems() {
    const { data, error } = await supabase.from('items').select('*');
    if (error) return console.error("خطأ:", error);

    const list = document.getElementById('items-list');
    // بناء مصفوفة النصوص ثم دمجها مرة واحدة (أسرع بكثير)
    list.innerHTML = data.map(item => `
        <tr class="border-b">
            <td class="p-2">${item.name}</td>
            <td class="p-2">${item.price} ريال</td>
        </tr>
    `).join(''); 
}
