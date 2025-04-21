import './UiKit.css'
import Header from "../components/layout/header/Header";
import Button from "../components/ui/button/Button";
import Datepicker from '../components/ui/datepicker/Datepicker';


const UiKit = () => {
    return (
        <>
            <Header></Header>
            <main>
                <section>
                    <h5 className='section-title'>Colors</h5>
                    <div className='horizontal-gallery'>
                        <div style={{
                                    background: 'var(--white)',
                                    width: '48px',
                                    height: '48px',
                                    border: '1px solid var(--black)'
                                }}>
                        </div>
                        <div style={{
                                    background: 'var(--black)',
                                    width: '48px',
                                    height: '48px',
                                    border: '1px solid var(--black)'
                                }}>
                        </div>
                        <div style={{
                                    background: 'var(--main-blue)',
                                    width: '48px',
                                    height: '48px',
                                    border: '1px solid var(--black)'
                                }}>    
                        </div>
                        <div style={{
                                    background: 'var(--main-purple)',
                                    width: '48px',
                                    height: '48px',
                                    border: '1px solid var(--black)'
                                }}>
                        </div>
                    </div>
                </section>
                <section>
                    <h5 className='section-title'>Typographies</h5>
                    <div>
                        <h1>This is an h1 tag</h1>
                        <h2>This is an h2 tag</h2>
                        <h3>This is an h3 tag</h3>
                        <h4>This is an h4 tag</h4>
                        <h5>This is an h5 tag</h5>
                        <h6>This is an h6 tag</h6>
                        <p>This is a paragraph</p>
                        <small>This is a small tag</small>
                    </div>
                </section>
                <section>
                    <h5 className='section-title'>Buttons</h5>
                    <div className='horizontal-gallery'>
                        <Button label="Primary" isDisabled={false} isFilter={false} variant="primary"></Button>
                        <Button label="Secondary" isDisabled={false} isFilter={false} variant="secondary"></Button>
                        <Button label="Primary" isDisabled={true} isFilter={false} variant="primary"></Button>
                        <Button label="Secondary" isDisabled={true} isFilter={false} variant="secondary"></Button>
                        <Button label="Filter" isDisabled={false} isFilter={true} variant="secondary"></Button>
                    </div>
                </section>
                <section>
                    <h5 className='section-title'>Datepickers</h5>
                    <div className='horizontal-gallery'>
                        <Datepicker></Datepicker>
                    </div>
                </section>
            </main>
            
        </>
    )
}

export default UiKit;