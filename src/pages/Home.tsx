import ProductList from '../components/ProductList'
import '../css/Home.css'

function Home() {
    return (
        <div>
            <ProductList isModalEnabled={true}/>
        </div>
    );
}

export default Home;
