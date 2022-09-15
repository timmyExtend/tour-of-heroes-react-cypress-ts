import {useState} from 'react'
import {useNavigate, Routes, Route} from 'react-router-dom'
import ListHeader from 'components/ListHeader'
import ModalYesNo from 'components/ModalYesNo'
import PageSpinner from 'components/PageSpinner'
import ErrorComp from 'components/ErrorComp'
import VillainList from './VillainList'
import VillainDetail from './VillainDetail'
import {useGetVillains} from 'hooks/useGetVillains'
import {useDeleteVillain} from 'hooks/useDeleteVillain'
import {Villain} from 'models/Villain'

export default function Villains() {
  const [showModal, setShowModal] = useState<boolean>(false)
  const {villains, status, getError} = useGetVillains()
  const [villainToDelete, setVillainToDelete] = useState<Villain | null>(null)
  const {deleteVillain, isDeleteError} = useDeleteVillain()

  const navigate = useNavigate()
  const addNewVillain = () => navigate('/villains/add-villain')
  const handleRefresh = () => navigate('/villains')

  const handleCloseModal = () => {
    setVillainToDelete(null)
    setShowModal(false)
  }
  // currying: the outer fn takes our custom arg and returns a fn that takes the event
  const handleDeleteVillain = (villain: Villain) => () => {
    setVillainToDelete(villain)
    setShowModal(true)
  }
  const handleDeleteFromModal = () => {
    villainToDelete ? deleteVillain(villainToDelete) : null
    setShowModal(false)
  }

  if (status === 'loading') {
    return <PageSpinner />
  }

  if (getError || isDeleteError) {
    return <ErrorComp />
  }

  return (
    <div data-cy="villains">
      <ListHeader
        title="Villains"
        handleAdd={addNewVillain}
        handleRefresh={handleRefresh}
      />
      <div>
        <div>
          <Routes>
            <Route
              path=""
              element={
                <VillainList
                  villains={villains}
                  handleDeleteVillain={handleDeleteVillain}
                />
              }
            />
            <Route path="/add-villain" element={<VillainDetail />} />
            <Route path="/edit-villain/:id" element={<VillainDetail />} />
            <Route
              path="*"
              element={
                <VillainList
                  villains={villains}
                  handleDeleteVillain={handleDeleteVillain}
                />
              }
            />
          </Routes>
        </div>
      </div>

      {showModal && (
        <ModalYesNo
          message="Would you like to delete the villain?"
          onNo={handleCloseModal}
          onYes={handleDeleteFromModal}
        />
      )}
    </div>
  )
}
